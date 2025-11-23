# 🎰 Poker Advisor - Lightning Fast Real-Time Helper

A blazing-fast, mobile-optimized poker advisor designed for real-time use while playing with friends. Get instant recommendations based on position, hand strength, pot odds, and more!

## ✨ Features

### 🚀 **Lightning Fast Input**
- **Quick Hand Entry**: Type `AA`, `KKs`, `AKo` instead of clicking cards individually
- **Keyboard Shortcuts**:
  - `Q` - Quick hand entry
  - `N` - New hand
  - `H` or `?` - Help menu
- **One-Click Presets**: Common hands (AA, KK, AKs, etc.) available as buttons
- **Touch Optimized**: Large touch targets perfect for mobile use

### 📱 **Mobile-First Design**
- Massive, clear action recommendations you can see at a glance
- Single-column layout optimized for phones
- Large buttons and inputs for easy tapping while playing
- Works great on desktop too!

### 🎯 **Smart Analysis**
- **Automatic Position Tracking**: Positions rotate each hand automatically
- **Hand Strength Evaluation**: Instant categorization (Premium, Strong, Playable, Weak)
- **Pot Odds Calculator**: Real-time math on whether to call or fold
- **Outs Counter**: Automatic detection of flush draws, straight draws, etc.
- **Street Detection**: Automatically knows if you're preflop, flop, turn, or river

### 🎓 **Beginner Friendly**
- Clear recommendations in plain English
- Beginner tips explain WHY you should take each action
- Position guide built-in
- No complex menus or settings to navigate

## 🌐 **Deploy for FREE (Recommended!)**

**Want to use it anywhere without running npm?**

Deploy to Vercel in 2 minutes and get a permanent URL you can bookmark:
1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub
3. Import this repository
4. Click "Deploy"
5. Done! Get a URL like `https://evaack.vercel.app`

**See [DEPLOY.md](DEPLOY.md) for complete instructions**

Now you can:
- ✅ Access from any device (PC, phone, tablet)
- ✅ No need to run npm start
- ✅ Share with friends
- ✅ Auto-updates when you push to GitHub

## 🏃 Quick Start (Local Development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Evaack/Evaack.git
cd Evaack

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Quick Start (Recommended)
1. Press `Q` or click "Quick" button
2. Type your hand: `AA`, `KK`, `AKs`, `QJo`, etc.
3. Hit Enter
4. Update pot size and bet to call
5. Get instant recommendation!

### Manual Card Selection
1. Click your hole cards to select them
2. Click board cards as they're revealed
3. Enter pot size and current bet
4. Read the recommendation

### Keyboard Shortcuts
- `Q` - Quick hand entry (fastest!)
- `N` - New hand (rotates positions automatically)
- `H` or `?` - Show help and keyboard shortcuts

## 📖 Understanding the Advice

### Action Colors
- **Green** - Strong play (raise, call with good odds)
- **Yellow/Orange** - Marginal/Conditional play
- **Red** - Fold
- **Blue** - Check or call in close spots

### Position Abbreviations
- **BTN** - Button (best position, acts last)
- **CO** - Cutoff (2nd best)
- **HJ** - Hijack
- **MP** - Middle Position
- **UTG** - Under the Gun (worst position)
- **SB** - Small Blind
- **BB** - Big Blind

### Hand Strength Categories
- **PREMIUM** - AA, KK, QQ, AK (play aggressively!)
- **STRONG** - JJ-77, AQ, AJ (play most situations)
- **PLAYABLE** - Suited connectors, suited aces (position-dependent)
- **MARGINAL** - Medium unsuited cards (careful)
- **WEAK** - Most other hands (fold)

## 🎯 Pro Tips

### Rule of 2 and 4
- **Turn/River**: Each out = ~2% chance to hit
- **Flop to River**: Each out = ~4% chance to hit
- Example: 9 outs on flop = ~36% to hit by river

### Pot Odds Made Simple
- If your equity % is higher than the pot odds % = CALL
- If your equity % is lower than the pot odds % = FOLD
- Example: 30% equity vs 25% pot odds = profitable call

### Position is Power
- Play more hands from BTN and CO
- Play fewer hands from UTG and early position
- The later you act, the more information you have

## 🛠️ Technical Stack

- **React 18** - Modern, fast UI
- **Vite** - Lightning-fast development and builds
- **Tailwind CSS** - Responsive, mobile-first styling
- **Lucide React** - Beautiful icons

## 📝 Development

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Share how you're using it

## 📄 License

MIT License - feel free to use, modify, and distribute!

## 🎲 Disclaimer

This tool is for educational and entertainment purposes. It provides general poker strategy advice based on common principles. Always play responsibly and within your means. Poker involves variance and no tool can guarantee winning results.

---

**Made with ♠️♥️♦️♣️ for poker enthusiasts**

Press `Q` to quick-start your poker journey! 🚀
