/**
 * SWIFT MT103 Message Parser
 * Parses and validates SWIFT MT103 (Single Customer Credit Transfer) messages
 * 
 * Based on .kiro/specs/swift-spec.md
 */

export interface SwiftField {
    tag: string;
    value: string;
}

export interface ParsedTransaction {
    reference?: string;
    bankOperationCode?: string;
    valueDate?: string;
    currency?: string;
    amount?: string;
    orderingCustomer?: {
        account?: string;
        name?: string;
        address?: string[];
    };
    beneficiary?: {
        account?: string;
        name?: string;
        address?: string[];
    };
    remittanceInfo?: string[];
    chargeBearer?: string;
    [key: string]: any;
}

export interface ParsedMessage {
    header?: {
        basicHeader?: string;
        applicationHeader?: string;
    };
    transaction: ParsedTransaction;
    valid: boolean;
    errors: string[];
    rawFields?: SwiftField[];
}

/**
 * Main SWIFT MT103 Parser Class
 */
export class SwiftParser {
    /**
     * Parse a complete SWIFT MT103 message
     */
    static parseMessage(swiftText: string): ParsedMessage {
        const result: ParsedMessage = {
            transaction: {},
            valid: true,
            errors: [],
            rawFields: []
        };

        try {
            // Extract blocks
            const blocks = this.extractBlocks(swiftText);

            // Parse headers
            if (blocks.block1) {
                result.header = result.header || {};
                result.header.basicHeader = blocks.block1;
            }

            if (blocks.block2) {
                result.header = result.header || {};
                result.header.applicationHeader = blocks.block2;
            }

            // Parse Block 4 (transaction data)
            if (!blocks.block4) {
                result.errors.push('Missing Block 4 (transaction data)');
                result.valid = false;
                return result;
            }

            const fields = this.extractFields(blocks.block4);
            result.rawFields = fields;

            // Parse each field
            fields.forEach(field => {
                this.parseField(field, result);
            });

            // Validate required fields
            this.validateRequiredFields(result);

        } catch (error) {
            result.errors.push(`Parse error: ${error instanceof Error ? error.message : String(error)}`);
            result.valid = false;
        }

        return result;
    }

    /**
     * Extract SWIFT message blocks
     */
    private static extractBlocks(swiftText: string): {
        block1?: string;
        block2?: string;
        block4?: string;
    } {
        const blocks: any = {};

        // Block 1: Basic Header
        const block1Match = swiftText.match(/\{1:([^}]+)\}/);
        if (block1Match) blocks.block1 = block1Match[1];

        // Block 2: Application Header
        const block2Match = swiftText.match(/\{2:([^}]+)\}/);
        if (block2Match) blocks.block2 = block2Match[1];

        // Block 4: Text Block
        const block4Match = swiftText.match(/\{4:\s*([\s\S]*?)\s*-?\}/);
        if (block4Match) blocks.block4 = block4Match[1];

        return blocks;
    }

    /**
     * Extract individual fields from Block 4
     */
    private static extractFields(block4: string): SwiftField[] {
        const fields: SwiftField[] = [];

        // Match fields like :20:VALUE or :50K:/ACCOUNT\nNAME\nADDRESS
        const fieldRegex = /:(\d{2}[A-Z]?):([\s\S]*?)(?=:\d{2}[A-Z]?:|$)/g;
        let match;

        while ((match = fieldRegex.exec(block4)) !== null) {
            fields.push({
                tag: match[1],
                value: match[2].trim()
            });
        }

        return fields;
    }

    /**
     * Parse individual field based on tag
     */
    private static parseField(field: SwiftField, result: ParsedMessage): void {
        const { tag, value } = field;

        switch (tag) {
            case '20':
                // Transaction Reference
                result.transaction.reference = value;
                if (value.length > 16) {
                    result.errors.push(`Field :20: exceeds max length of 16 characters`);
                    result.valid = false;
                }
                break;

            case '23B':
                // Bank Operation Code
                result.transaction.bankOperationCode = value;
                const validCodes = ['CRED', 'CRTS', 'SPAY', 'SPRI', 'SSTD'];
                if (!validCodes.includes(value)) {
                    result.errors.push(`Field :23B: invalid code '${value}'. Must be one of: ${validCodes.join(', ')}`);
                    result.valid = false;
                }
                break;

            case '32A':
                // Value Date, Currency, Amount
                this.parse32A(value, result);
                break;

            case '50K':
                // Ordering Customer
                result.transaction.orderingCustomer = this.parseCustomerField(value);
                break;

            case '59':
                // Beneficiary Customer
                result.transaction.beneficiary = this.parseCustomerField(value);
                break;

            case '70':
                // Remittance Information
                result.transaction.remittanceInfo = value.split('\n').filter(line => line.trim());
                break;

            case '71A':
                // Details of Charges
                result.transaction.chargeBearer = value;
                const validCharges = ['BEN', 'OUR', 'SHA'];
                if (!validCharges.includes(value)) {
                    result.errors.push(`Field :71A: invalid value '${value}'. Must be one of: ${validCharges.join(', ')}`);
                    result.valid = false;
                }
                break;

            default:
                // Store unknown fields
                result.transaction[`field_${tag}`] = value;
        }
    }

    /**
     * Parse Field 32A (Value Date, Currency, Amount)
     */
    private static parse32A(value: string, result: ParsedMessage): void {
        // Format: YYMMDDCCCAMOUNT
        // Example: 231205USD10000,00

        const match = value.match(/^(\d{6})([A-Z]{3})([\d,]+)$/);

        if (!match) {
            result.errors.push(`Field :32A: invalid format. Expected YYMMDDCCCAMOUNT, got '${value}'`);
            result.valid = false;
            return;
        }

        const [, date, currency, amount] = match;

        // Parse date
        const year = parseInt(date.substring(0, 2));
        const month = parseInt(date.substring(2, 4));
        const day = parseInt(date.substring(4, 6));

        if (month < 1 || month > 12) {
            result.errors.push(`Field :32A: invalid month '${month}'`);
            result.valid = false;
        }

        if (day < 1 || day > 31) {
            result.errors.push(`Field :32A: invalid day '${day}'`);
            result.valid = false;
        }

        result.transaction.valueDate = `20${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        result.transaction.currency = currency;

        // Convert amount (SWIFT uses comma as decimal separator)
        result.transaction.amount = amount.replace(',', '.');
    }

    /**
     * Parse customer field (50K or 59)
     */
    private static parseCustomerField(value: string): {
        account?: string;
        name?: string;
        address?: string[];
    } {
        const lines = value.split('\n').map(l => l.trim()).filter(l => l);
        const customer: any = {};

        if (lines.length > 0) {
            // First line might be account (starts with /)
            if (lines[0].startsWith('/')) {
                customer.account = lines[0].substring(1);
                lines.shift();
            }

            // Next line is name
            if (lines.length > 0) {
                customer.name = lines[0];
                lines.shift();
            }

            // Remaining lines are address
            if (lines.length > 0) {
                customer.address = lines;
            }
        }

        return customer;
    }

    /**
     * Validate required fields are present
     */
    private static validateRequiredFields(result: ParsedMessage): void {
        const required = ['reference', 'bankOperationCode', 'valueDate', 'currency', 'amount', 'orderingCustomer', 'beneficiary', 'chargeBearer'];

        required.forEach(field => {
            if (!result.transaction[field]) {
                result.errors.push(`Missing required field: ${field}`);
                result.valid = false;
            }
        });
    }

    /**
     * Format parsed message as JSON string
     */
    static formatJSON(parsed: ParsedMessage, pretty: boolean = true): string {
        return JSON.stringify(parsed, null, pretty ? 2 : 0);
    }

    /**
     * Get sample SWIFT MT103 message for testing
     */
    static getSampleMessage(): string {
        return `{1:F01BANKBEBBAXXX0000000000}
{2:I103BANKDEFFXXXXN}
{4:
:20:REF20231205001
:23B:CRED
:32A:231205USD10000,00
:50K:/1234567890
JOHN DOE
123 MAIN STREET
NEW YORK NY 10001
:59:/9876543210
JANE SMITH
456 ELM AVENUE
LOS ANGELES CA 90001
:70:INVOICE INV-2023-12345
PAYMENT FOR SERVICES
:71A:SHA
-}`;
    }
}
