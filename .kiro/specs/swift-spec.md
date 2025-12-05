# SWIFT MT103 Message Specification

## Overview
This specification defines the structure and validation rules for SWIFT MT103 (Single Customer Credit Transfer) messages for the SWIFT.HAUNT parser.

## Message Structure

### Block 1: Basic Header
- Format: `{1:F01BANKBEBBAXXX0000000000}`
- Contains: Application ID, Service ID, LT Address, Session/Sequence

### Block 2: Application Header
- Format: `{2:I103BANKDEFFXXXXN}`
- Contains: I/O Identifier, Message Type, Destination Address, Priority

### Block 4: Text Block
Contains the actual payment instruction fields.

## Required Fields

### Field :20: Transaction Reference
- **Format**: `:20:REFERENCE`
- **Length**: Max 16 characters
- **Type**: Alphanumeric
- **Required**: Yes
- **Description**: Sender's reference for the transaction

### Field :23B: Bank Operation Code
- **Format**: `:23B:CODE`
- **Values**: CRED, CRTS, SPAY, SPRI, SSTD
- **Required**: Yes
- **Description**: Type of payment

### Field :32A: Value Date, Currency, Amount
- **Format**: `:32A:YYMMDDCCCAMOUNT`
- **Example**: `:32A:231205USD10000,00`
- **Components**:
  - Date: YYMMDD (6 digits)
  - Currency: 3-letter ISO code
  - Amount: Up to 15 digits with decimal
- **Required**: Yes

### Field :50K: Ordering Customer
- **Format**: `:50K:/ACCOUNT\nNAME\nADDRESS`
- **Lines**: Up to 4 lines, 35 chars each
- **Required**: Yes
- **Description**: Customer initiating the payment

### Field :59: Beneficiary Customer
- **Format**: `:59:/ACCOUNT\nNAME\nADDRESS`
- **Lines**: Up to 4 lines, 35 chars each
- **Required**: Yes
- **Description**: Customer receiving the payment

### Field :71A: Details of Charges
- **Format**: `:71A:CODE`
- **Values**: BEN, OUR, SHA
- **Required**: Yes
- **Description**: Who bears the charges
  - BEN: Beneficiary pays all charges
  - OUR: Ordering customer pays all charges
  - SHA: Shared charges

## Optional Fields

### Field :50A: Ordering Customer (Option A)
- Alternative to :50K: with BIC code

### Field :52A: Ordering Institution
- **Format**: `:52A:BIC`
- Bank acting on behalf of ordering customer

### Field :56A: Intermediary Institution
- **Format**: `:56A:BIC`
- Intermediary bank in the payment chain

### Field :57A: Account With Institution
- **Format**: `:57A:BIC`
- Beneficiary's bank

### Field :70: Remittance Information
- **Format**: `:70:FREE TEXT`
- **Lines**: Up to 4 lines, 35 chars each
- Payment purpose/invoice details

### Field :72: Sender to Receiver Information
- **Format**: `:72:FREE TEXT`
- Additional instructions

## Validation Rules

### General Rules
1. All fields must start with `:` and field tag
2. Field tag must be followed by `:`
3. Multi-line fields use line breaks
4. Maximum line length: 35 characters (except amounts)
5. No special characters except allowed punctuation

### Date Validation
- Format: YYMMDD
- Year: 00-99
- Month: 01-12
- Day: 01-31 (validate against month)

### Currency Validation
- Must be valid ISO 4217 3-letter code
- Common: USD, EUR, GBP, JPY, CHF, CAD, AUD

### Amount Validation
- Maximum 15 digits before decimal
- Maximum 2 digits after decimal
- Use comma (,) as decimal separator in SWIFT
- No thousands separators

### BIC Validation
- Format: AAAABBCCXXX or AAAABBCC
- Length: 8 or 11 characters
- AAAA: Bank code (letters)
- BB: Country code (letters)
- CC: Location code (alphanumeric)
- XXX: Branch code (optional, alphanumeric)

## Sample Valid Message

```
{1:F01BANKBEBBAXXX0000000000}
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
-}
```

## Parser Implementation Requirements

### Core Functions
1. `parseMessage(swiftText)` - Main parser entry point
2. `validateField(fieldTag, fieldValue)` - Field-specific validation
3. `extractFields(block4)` - Extract all fields from Block 4
4. `formatOutput(parsedData)` - Convert to JSON

### Error Handling
- Invalid field format
- Missing required fields
- Invalid field values
- Malformed message structure
- Character encoding issues

### Output Format (JSON)
```json
{
  "header": {
    "basicHeader": "...",
    "applicationHeader": "..."
  },
  "transaction": {
    "reference": "REF20231205001",
    "bankOperationCode": "CRED",
    "valueDate": "2023-12-05",
    "currency": "USD",
    "amount": "10000.00",
    "orderingCustomer": {
      "account": "1234567890",
      "name": "JOHN DOE",
      "address": ["123 MAIN STREET", "NEW YORK NY 10001"]
    },
    "beneficiary": {
      "account": "9876543210",
      "name": "JANE SMITH",
      "address": ["456 ELM AVENUE", "LOS ANGELES CA 90001"]
    },
    "remittanceInfo": ["INVOICE INV-2023-12345", "PAYMENT FOR SERVICES"],
    "chargeBearer": "SHA"
  },
  "valid": true,
  "errors": []
}
```

## Test Cases

### Valid Messages
1. Minimal required fields only
2. All optional fields included
3. Maximum length fields
4. Different currencies
5. Different charge bearers

### Invalid Messages
1. Missing required field :20:
2. Invalid date format
3. Invalid currency code
4. Amount exceeds max length
5. Invalid BIC format
6. Line exceeds 35 characters
7. Malformed block structure

## Kiro Usage Notes
This spec was used to guide Kiro in generating the SWIFT parser. Key aspects:
- Detailed field formats helped Kiro generate accurate regex patterns
- Validation rules translated directly to validation functions
- Sample messages provided test cases
- JSON output format defined the parser's return structure
