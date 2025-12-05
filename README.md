# SWIFT.HAUNT

**Resurrecting 1973 Banking Protocol from the Dead** 🏦💀

A modern web interface for parsing and validating SWIFT MT103 messages, built for the Kiroween 2024 Hackathon.

## 🎃 Kiroween Category: Resurrection

SWIFT (Society for Worldwide Interbank Financial Telecommunication) was founded in **1973** - over 50 years ago! This "dead" technology still powers trillions of dollars in international payments every day. SWIFT.HAUNT brings this legacy protocol into the modern web era with a haunted banking theme.

## ✨ Features

- 📨 **SWIFT MT103 Parser**: Parse Single Customer Credit Transfer messages
- ✅ **Field Validation**: Comprehensive validation of all SWIFT fields
- 💰 **Transaction Display**: Beautiful visualization of parsed payment data
- 📄 **JSON Export**: Convert SWIFT messages to modern JSON format
- 🎨 **Haunted UI**: Dark, eerie banking interface with ambient sound
- 📱 **Mobile Responsive**: Works on all devices

## 🚀 Live Demo

**URL**: [Coming Soon - Deploying to Vercel]

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Parser**: Custom TypeScript SWIFT parser
- **Theme**: Haunted banking aesthetic

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/[username]/swift-haunt.git

# Install dependencies
cd swift-haunt
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 How It Works

1. **Input**: Paste a SWIFT MT103 message
2. **Parse**: Click "Parse Message" to extract fields
3. **View**: See transaction details or JSON output
4. **Export**: Copy JSON for use in modern systems

## 📖 SWIFT MT103 Format

MT103 is used for customer credit transfers. Example:

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
:59:/9876543210
JANE SMITH
456 ELM AVENUE
:71A:SHA
-}
```

## 🤖 Kiro Integration

This project was built using Kiro's powerful features:

### Spec-Driven Development
- `.kiro/specs/swift-spec.md` - Comprehensive SWIFT MT103 specification
- Guided Kiro in generating accurate parser logic
- Defined validation rules and field formats

### Agent Hooks
- `.kiro/hooks/pre-commit.sh` - Automated quality checks
- Validates TypeScript compilation
- Ensures .kiro directory is not gitignored

### Steering Documents
- `.kiro/steering/fintech-guidelines.md` - Banking domain knowledge
- Guides Kiro on financial terminology
- Ensures proper error handling for financial data

## 📝 License

MIT License - See [LICENSE](LICENSE) file

## 🎃 Hackathon Submission

- **Event**: Kiroween 2024
- **Category**: Resurrection
- **Theme**: Bringing dead SWIFT protocol back to life
- **Built with**: Kiro AI-powered IDE

## ⚠️ Disclaimer

This is an educational demo tool only. Not for production use. No real banking connections or sensitive data handling.

---

Built with 💀 for Kiroween 2024
