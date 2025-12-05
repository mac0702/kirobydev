# Fintech & Banking Steering Guidelines

## Purpose
This document guides Kiro in understanding financial terminology, banking conventions, and compliance requirements when generating code for SWIFT.HAUNT.

## Financial Domain Knowledge

### SWIFT Network
- **SWIFT**: Society for Worldwide Interbank Financial Telecommunication
- **Purpose**: Secure messaging network for international financial transactions
- **History**: Founded 1973, replaced Telex for bank communications
- **Modern relevance**: Still used for cross-border payments despite being "legacy"

### Banking Terminology
- **MT (Message Type)**: SWIFT message format standard
- **BIC (Bank Identifier Code)**: Unique bank identification (also called SWIFT code)
- **IBAN**: International Bank Account Number
- **Correspondent Banking**: Banks acting as intermediaries for other banks
- **Nostro/Vostro**: Accounts banks hold with each other

### Payment Types
- **Credit Transfer**: Moving money from one account to another
- **Wire Transfer**: Electronic fund transfer between banks
- **Cross-border Payment**: International money transfer
- **Remittance**: Money sent to another party, often internationally

## Code Generation Guidelines

### Error Handling for Financial Data
When generating parser code, Kiro should:
1. **Never silently fail** - All parsing errors must be explicit
2. **Validate amounts** - Check for overflow, negative values, excessive decimals
3. **Preserve precision** - Use appropriate number types (Decimal/BigDecimal, not float)
4. **Log all validation failures** - Financial errors need audit trails

### Security Considerations
1. **No sensitive data in logs** - Mask account numbers, amounts in debug output
2. **Input sanitization** - Validate all SWIFT message inputs
3. **No external API calls** - This is a demo tool, no real banking connections
4. **Clear disclaimers** - Mark as educational/demo tool only

### Compliance Awareness
1. **Data privacy** - No storage of real financial data
2. **Regulatory context** - Acknowledge SWIFT is regulated
3. **Demo limitations** - Clearly state this is not production-ready
4. **No financial advice** - Tool is for parsing/learning only

## SWIFT-Specific Conventions

### Field Formatting
- **Dates**: Always YYMMDD format (not YYYY-MM-DD)
- **Amounts**: Comma as decimal separator (European convention)
- **Line length**: 35 characters maximum (SWIFT network limitation)
- **Character set**: Limited to SWIFT-safe characters (no emojis, special Unicode)

### Message Structure
- **Blocks**: SWIFT messages have 5 blocks (1-5)
- **Mandatory fields**: Some fields are required by SWIFT standard
- **Optional fields**: Many fields are conditional based on payment type
- **Field order**: Fields must appear in specific sequence

### Validation Philosophy
- **Strict parsing**: Reject malformed messages rather than guessing
- **Clear errors**: Tell user exactly what's wrong and where
- **Helpful messages**: Suggest corrections when possible
- **Standards compliance**: Follow SWIFT standards exactly

## Code Style for Financial Applications

### Naming Conventions
- Use banking domain terms: `beneficiary`, `orderingCustomer`, `remittanceInfo`
- Avoid abbreviations unless standard (BIC, IBAN, MT103)
- Be explicit: `parseMT103Message` not `parseMsg`

### Comments
- Explain financial concepts for non-banking developers
- Reference SWIFT standards documentation
- Note any regulatory implications
- Clarify business logic vs technical logic

### Testing
- Test with realistic SWIFT messages
- Include edge cases (max amounts, all optional fields)
- Test validation (invalid dates, currencies, BICs)
- Verify error messages are helpful

## Kiro Interaction Patterns

### When Generating Parsers
Kiro should ask:
- "Which SWIFT message types to support?" (MT103, MT202, etc.)
- "Should we validate BICs against a list or just format?"
- "How should we handle optional fields?"
- "What level of validation strictness?"

### When Generating UI
Kiro should consider:
- "Should we show raw SWIFT vs parsed JSON?"
- "How to display validation errors clearly?"
- "Should we provide example messages?"
- "How to make financial data readable?"

### When Explaining Code
Kiro should:
- Explain banking concepts in comments
- Reference SWIFT standards where applicable
- Clarify why certain validations exist
- Note any simplifications made for demo purposes

## Common Pitfalls to Avoid

### Financial Data Handling
❌ Using `parseFloat()` for amounts (loses precision)
✅ Using string manipulation or Decimal libraries

❌ Storing amounts as cents/integers (confusing)
✅ Storing as decimal strings with explicit currency

❌ Assuming USD (currency-centric)
✅ Always requiring explicit currency code

### SWIFT Parsing
❌ Regex that's too permissive (accepts invalid messages)
✅ Strict regex matching SWIFT specs exactly

❌ Ignoring field order requirements
✅ Validating fields appear in correct sequence

❌ Treating all fields as optional
✅ Enforcing required fields per MT type

### User Experience
❌ Cryptic error messages ("Invalid field 32A")
✅ Helpful errors ("Field :32A: date must be YYMMDD format, got '2023-12-05'")

❌ No examples or documentation
✅ Providing sample messages and clear instructions

## Resurrection Theme Integration

Since this is for Kiroween "Resurrection" category:
- **Emphasize legacy**: "SWIFT from 1973, still powering global finance"
- **Modern twist**: "Bringing 50-year-old protocol to modern web"
- **Educational angle**: "Learn how banks communicated before APIs"
- **Nostalgia**: "When financial messages looked like this..."

## Kiro's Role
This steering document helps Kiro:
1. Generate financially-aware code
2. Use correct banking terminology
3. Apply appropriate validation rigor
4. Create helpful error messages
5. Understand the domain context

When Kiro generates code for SWIFT.HAUNT, it should embody the mindset of a fintech developer who respects the complexity and importance of financial systems while making them accessible and educational.
