import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCw, Users, Sparkles, Target, Calculator, Play, X, DollarSign, Zap, Award, Info, Keyboard, Clock } from 'lucide-react';

const App = () => {
  const [numPlayers, setNumPlayers] = useState(6);
  const [dealerPosition, setDealerPosition] = useState(1);
  const [myPosition, setMyPosition] = useState(3);
  const [myHand, setMyHand] = useState([null, null]);
  const [communityCards, setCommunityCards] = useState([null, null, null, null, null]);
  const [potSize, setPotSize] = useState(1.5);
  const [currentBet, setCurrentBet] = useState(1);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [pickingCardIndex, setPickingCardIndex] = useState(null);
  const [pickingCardType, setPickingCardType] = useState(null);
  const [currentStreet, setCurrentStreet] = useState('preflop');
  const [handNumber, setHandNumber] = useState(1);
  const [quickHandInput, setQuickHandInput] = useState('');
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const quickInputRef = useRef(null);

  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const suits = ['s', 'h', 'd', 'c'];

  const suitSymbols = {
    's': { symbol: '♠', color: '#000000', name: 'Spades' },
    'h': { symbol: '♥', color: '#dc2626', name: 'Hearts' },
    'd': { symbol: '♦', color: '#2563eb', name: 'Diamonds' },
    'c': { symbol: '♣', color: '#16a34a', name: 'Clubs' }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch(e.key.toLowerCase()) {
        case 'n':
          newHand();
          break;
        case 'q':
          setShowQuickInput(true);
          setTimeout(() => quickInputRef.current?.focus(), 100);
          break;
        case 'h':
          setShowHelp(prev => !prev);
          break;
        case '?':
          setShowHelp(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [numPlayers]);

  // Quick hand input parser
  const parseQuickHand = (input) => {
    const cleaned = input.toUpperCase().trim();

    // Handle pairs (AA, KK, QQ, etc.)
    if (cleaned.length === 2 && ranks.includes(cleaned[0]) && cleaned[0] === cleaned[1]) {
      return [
        { rank: cleaned[0], suit: 's' },
        { rank: cleaned[0], suit: 'h' }
      ];
    }

    // Handle suited hands (AKs, QJs, etc.)
    if (cleaned.length === 3 && cleaned[2] === 'S' && ranks.includes(cleaned[0]) && ranks.includes(cleaned[1])) {
      return [
        { rank: cleaned[0], suit: 's' },
        { rank: cleaned[1], suit: 's' }
      ];
    }

    // Handle offsuit hands (AKo, QJo, etc.)
    if (cleaned.length === 3 && cleaned[2] === 'O' && ranks.includes(cleaned[0]) && ranks.includes(cleaned[1])) {
      return [
        { rank: cleaned[0], suit: 's' },
        { rank: cleaned[1], suit: 'h' }
      ];
    }

    // Handle two card notation (AK assumes offsuit)
    if (cleaned.length === 2 && ranks.includes(cleaned[0]) && ranks.includes(cleaned[1]) && cleaned[0] !== cleaned[1]) {
      return [
        { rank: cleaned[0], suit: 's' },
        { rank: cleaned[1], suit: 'h' }
      ];
    }

    return null;
  };

  const handleQuickHandSubmit = () => {
    const parsed = parseQuickHand(quickHandInput);
    if (parsed) {
      setMyHand(parsed);
      setQuickHandInput('');
      setShowQuickInput(false);
    }
  };

  // Position calculation
  const getPositionName = (seat) => {
    const sbPos = dealerPosition === numPlayers ? 1 : dealerPosition + 1;
    const bbPos = sbPos === numPlayers ? 1 : sbPos + 1;

    if (seat === dealerPosition) return { name: 'BTN', order: numPlayers, color: 'text-yellow-400' };
    if (seat === sbPos) return { name: 'SB', order: 1, color: 'text-blue-400' };
    if (seat === bbPos) return { name: 'BB', order: 2, color: 'text-purple-400' };

    let position = bbPos;
    const positionNames = [];

    while (position !== dealerPosition) {
      position = position === numPlayers ? 1 : position + 1;
      if (position !== dealerPosition) {
        positionNames.push(position);
      }
    }

    const idx = positionNames.indexOf(seat);
    if (idx === -1) return { name: 'BTN', order: numPlayers, color: 'text-yellow-400' };

    if (numPlayers <= 4) {
      return { name: 'UTG', order: 3, color: 'text-red-400' };
    } else if (numPlayers <= 6) {
      const names = ['UTG', 'HJ', 'CO'];
      const nameIdx = Math.min(idx, names.length - 1);
      return { name: names[nameIdx], order: 3 + idx, color: 'text-orange-400' };
    } else {
      if (idx === 0) return { name: 'UTG', order: 3, color: 'text-red-400' };
      if (idx === positionNames.length - 1) return { name: 'CO', order: numPlayers - 1, color: 'text-green-400' };
      return { name: `MP${idx}`, order: 3 + idx, color: 'text-orange-400' };
    }
  };

  // Streamlined card picker
  const CardPicker = () => {
    const selectCard = (rank, suit) => {
      const card = { rank, suit };
      if (pickingCardType === 'hand') {
        const newHand = [...myHand];
        newHand[pickingCardIndex] = card;
        setMyHand(newHand);
      } else {
        const newCommunity = [...communityCards];
        newCommunity[pickingCardIndex] = card;
        setCommunityCards(newCommunity);

        const filledCards = newCommunity.filter(c => c !== null).length;
        if (filledCards === 0) setCurrentStreet('preflop');
        else if (filledCards <= 3) setCurrentStreet('flop');
        else if (filledCards === 4) setCurrentStreet('turn');
        else if (filledCards === 5) setCurrentStreet('river');
      }
      setShowCardPicker(false);
    };

    const isCardUsed = (rank, suit) => {
      const allCards = [...myHand, ...communityCards].filter(c => c !== null);
      return allCards.some(card => card.rank === rank && card.suit === suit);
    };

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 max-w-2xl w-full border border-green-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-green-400">Select Card</h3>
            <button
              onClick={() => setShowCardPicker(false)}
              className="p-2 hover:bg-red-500/20 rounded-lg"
            >
              <X className="w-6 h-6 text-red-400" />
            </button>
          </div>

          <div className="space-y-2">
            {suits.map(suit => (
              <div key={suit}>
                <div className="text-xs font-bold mb-1 flex items-center gap-2" style={{ color: suitSymbols[suit].color }}>
                  <span className="text-xl">{suitSymbols[suit].symbol}</span>
                </div>
                <div className="grid grid-cols-13 gap-1">
                  {ranks.map(rank => {
                    const used = isCardUsed(rank, suit);
                    return (
                      <button
                        key={`${rank}${suit}`}
                        onClick={() => !used && selectCard(rank, suit)}
                        disabled={used}
                        className={`
                          aspect-square rounded-md font-bold text-base sm:text-lg transition-all
                          ${used
                            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            : 'bg-black/60 hover:bg-green-600/30 active:bg-green-600/50 border border-green-500/30 hover:border-green-400 text-white active:scale-95'
                          }
                        `}
                      >
                        {rank}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Card display component
  const CardDisplay = ({ card, onClick, label, isEmpty = false, size = 'normal' }) => {
    const sizeClasses = size === 'large'
      ? 'w-24 h-32 sm:w-28 sm:h-36'
      : 'w-16 h-24 sm:w-20 sm:h-28';

    if (isEmpty || !card) {
      return (
        <button
          onClick={onClick}
          className={`relative ${sizeClasses} bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-dashed border-green-500/30 hover:border-green-400 active:border-green-500 transition-all active:scale-95 flex flex-col items-center justify-center group`}
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-400/40 group-hover:text-green-400 group-active:text-green-500" />
          <div className="text-xs text-green-400/60 mt-1">{label}</div>
        </button>
      );
    }

    const suitInfo = suitSymbols[card.suit];
    return (
      <button
        onClick={onClick}
        className={`relative ${sizeClasses} bg-gradient-to-br from-white to-gray-100 rounded-lg border-2 border-gray-700 shadow-xl transition-all active:scale-95 hover:shadow-2xl`}
      >
        <div className="absolute top-0.5 left-1 text-xl sm:text-2xl font-bold" style={{ color: suitInfo.color }}>
          {card.rank}
        </div>
        <div className="absolute top-5 sm:top-7 left-1 text-2xl sm:text-3xl" style={{ color: suitInfo.color }}>
          {suitInfo.symbol}
        </div>
        <div className="absolute bottom-0.5 right-1 text-xl sm:text-2xl font-bold rotate-180" style={{ color: suitInfo.color }}>
          {card.rank}
        </div>
      </button>
    );
  };

  // Hand analysis
  const analyzeHand = () => {
    if (!myHand[0] || !myHand[1]) return null;

    const analysis = {
      strength: 'unknown',
      outs: [],
      totalOuts: 0,
      recommendation: '',
      confidence: 0,
      explanation: ''
    };

    const isPair = myHand[0].rank === myHand[1].rank;
    const isSuited = myHand[0].suit === myHand[1].suit;

    const rankValue = (rank) => {
      const values = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10};
      return values[rank] || parseInt(rank);
    };

    const v1 = rankValue(myHand[0].rank);
    const v2 = rankValue(myHand[1].rank);
    const highCard = Math.max(v1, v2);
    const lowCard = Math.min(v1, v2);

    if (isPair && highCard >= 10) {
      analysis.strength = 'PREMIUM';
      analysis.explanation = 'Premium pocket pair - Play aggressively!';
    } else if ((highCard === 14 && lowCard >= 11) || (isPair && highCard >= 7)) {
      analysis.strength = 'STRONG';
      analysis.explanation = 'Strong hand - Good to raise or call';
    } else if (isSuited && highCard >= 10 && lowCard >= 8) {
      analysis.strength = 'PLAYABLE';
      analysis.explanation = 'Playable hand - Consider position';
    } else if (highCard >= 11 && lowCard >= 9) {
      analysis.strength = 'MARGINAL';
      analysis.explanation = 'Marginal hand - Proceed with caution';
    } else {
      analysis.strength = 'WEAK';
      analysis.explanation = 'Weak hand - Usually fold';
    }

    const board = communityCards.filter(c => c !== null);
    if (board.length >= 3) {
      const allCards = [...myHand, ...board];

      const suitCounts = {};
      allCards.forEach(card => {
        suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
      });

      Object.entries(suitCounts).forEach(([suit, count]) => {
        if (count === 4) {
          analysis.outs.push({ type: 'Flush Draw', count: 9, icon: '💧' });
          analysis.totalOuts += 9;
        }
      });

      const values = allCards.map(c => rankValue(c.rank));
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

      let straightOuts = 0;
      for (let i = 0; i <= uniqueValues.length - 4; i++) {
        if (uniqueValues[i + 3] - uniqueValues[i] <= 4) {
          straightOuts = 8;
          break;
        }
      }

      if (straightOuts === 0) {
        for (let i = 0; i <= uniqueValues.length - 3; i++) {
          if (uniqueValues[i + 2] - uniqueValues[i] <= 4) {
            straightOuts = 4;
            break;
          }
        }
      }

      if (straightOuts > 0) {
        analysis.outs.push({
          type: straightOuts === 8 ? 'Open Straight' : 'Gutshot',
          count: straightOuts,
          icon: '📏'
        });
        analysis.totalOuts = Math.min(analysis.totalOuts + straightOuts, 15);
      }
    }

    return analysis;
  };

  // Get recommendation
  const getRecommendation = () => {
    const analysis = analyzeHand();
    if (!analysis) return null;

    const position = getPositionName(myPosition);
    const isEarly = ['UTG', 'MP', 'MP1', 'MP2'].some(p => position.name.includes(p));
    const isLate = ['CO', 'BTN'].includes(position.name);

    let action = '';
    let explanation = '';
    let beginnerTip = '';
    let actionColor = 'from-yellow-400 to-orange-400';

    if (currentStreet === 'preflop') {
      if (analysis.strength === 'PREMIUM') {
        action = currentBet > 0 ? 'RAISE 3x' : 'RAISE';
        actionColor = 'from-green-400 to-emerald-400';
        explanation = `Premium hand in ${position.name}!`;
        beginnerTip = 'Premium hands win most of the time. Build a big pot!';
      } else if (analysis.strength === 'STRONG') {
        if (isEarly) {
          action = currentBet > 0 ? 'CALL' : 'RAISE';
          actionColor = 'from-blue-400 to-cyan-400';
          explanation = `Strong hand but early position`;
          beginnerTip = 'Early position = more risk. Play carefully.';
        } else {
          action = currentBet > 0 ? 'CALL/RAISE' : 'RAISE';
          actionColor = 'from-green-400 to-emerald-400';
          explanation = `Strong hand in ${position.name}!`;
          beginnerTip = 'Late position is powerful - use it!';
        }
      } else if (analysis.strength === 'PLAYABLE') {
        if (isLate && currentBet === 0) {
          action = 'RAISE (STEAL)';
          actionColor = 'from-yellow-400 to-orange-400';
          explanation = 'Steal the blinds!';
          beginnerTip = 'Late + unopened = great stealing spot!';
        } else if (currentBet <= 2) {
          action = 'CALL';
          actionColor = 'from-blue-400 to-cyan-400';
          explanation = 'Cheap flop is fine';
          beginnerTip = 'Worth seeing cheap flops with decent hands.';
        } else {
          action = 'FOLD';
          actionColor = 'from-red-400 to-rose-400';
          explanation = 'Too expensive';
          beginnerTip = 'Save chips for better spots!';
        }
      } else {
        action = 'FOLD';
        actionColor = 'from-red-400 to-rose-400';
        explanation = 'Not worth playing';
        beginnerTip = 'Most hands are trash. Folding = winning!';
      }
    } else {
      if (currentBet > 0 && potSize > 0) {
        const potOdds = (currentBet / (potSize + currentBet)) * 100;
        const cardsTocome = currentStreet === 'flop' ? 2 : 1;
        const equity = analysis.totalOuts * (cardsTocome === 2 ? 4 : 2);

        if (equity > potOdds + 5) {
          action = 'CALL';
          actionColor = 'from-green-400 to-emerald-400';
          explanation = `Great odds! ${analysis.totalOuts} outs = ${equity.toFixed(0)}%`;
          beginnerTip = `${analysis.totalOuts} outs is strong - definitely call!`;
        } else if (equity > potOdds - 5) {
          action = 'CALL (CLOSE)';
          actionColor = 'from-yellow-400 to-orange-400';
          explanation = `Borderline with ${analysis.totalOuts} outs`;
          beginnerTip = 'Close decision - think about implied odds.';
        } else {
          action = 'FOLD';
          actionColor = 'from-red-400 to-rose-400';
          explanation = `Not enough outs (${analysis.totalOuts})`;
          beginnerTip = `Need ~${Math.ceil(potOdds/2)} outs to call here.`;
        }
      } else {
        if (analysis.totalOuts >= 8) {
          action = 'BET/CHECK';
          actionColor = 'from-blue-400 to-cyan-400';
          explanation = `Strong draw - ${analysis.totalOuts} outs`;
          beginnerTip = 'Big draws can bet or check for free card.';
        } else {
          action = 'CHECK';
          actionColor = 'from-gray-400 to-gray-500';
          explanation = 'See what develops';
          beginnerTip = 'Checking is safe and gives info.';
        }
      }
    }

    return {
      action,
      actionColor,
      explanation,
      beginnerTip,
      analysis,
      position: position.name,
      positionColor: position.color
    };
  };

  // New hand
  const newHand = () => {
    setMyHand([null, null]);
    setCommunityCards([null, null, null, null, null]);
    setCurrentStreet('preflop');
    setPotSize(1.5);
    setCurrentBet(1);
    setHandNumber(prev => prev + 1);
    setDealerPosition(prev => prev === numPlayers ? 1 : prev + 1);
  };

  // Pot odds calculation
  const getPotOddsDisplay = () => {
    if (currentBet === 0 || potSize === 0) return null;

    const analysis = analyzeHand();
    if (!analysis || currentStreet === 'preflop') return null;

    const potOdds = (currentBet / (potSize + currentBet)) * 100;
    const cardsTocome = currentStreet === 'flop' ? 2 : 1;
    const equity = analysis.totalOuts * (cardsTocome === 2 ? 4 : 2);
    const ev = (equity / 100) * (potSize + currentBet) - currentBet;

    return {
      potOdds: potOdds.toFixed(1),
      equity: equity.toFixed(1),
      ev: ev.toFixed(2),
      profitable: equity > potOdds
    };
  };

  const recommendation = getRecommendation();
  const potOddsDisplay = getPotOddsDisplay();

  // Preset common hands
  const commonHands = [
    { label: 'AA', hand: 'AA' },
    { label: 'KK', hand: 'KK' },
    { label: 'AKs', hand: 'AKs' },
    { label: 'AK', hand: 'AKo' },
    { label: 'QQ', hand: 'QQ' },
    { label: 'JJ', hand: 'JJ' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 p-2 sm:p-4">
      {showCardPicker && <CardPicker />}

      {/* Quick Hand Input Modal */}
      {showQuickInput && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-md w-full border border-green-500/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-400">Quick Hand Entry</h3>
              <button onClick={() => setShowQuickInput(false)} className="p-2 hover:bg-red-500/20 rounded-lg">
                <X className="w-6 h-6 text-red-400" />
              </button>
            </div>

            <input
              ref={quickInputRef}
              type="text"
              value={quickHandInput}
              onChange={(e) => setQuickHandInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickHandSubmit()}
              placeholder="Type: AA, KK, AKs, AKo, QJs..."
              className="w-full px-4 py-3 bg-black/50 text-green-400 text-xl rounded-lg border border-green-500/50 focus:border-green-400 focus:outline-none mb-4"
              autoFocus
            />

            <div className="grid grid-cols-3 gap-2 mb-4">
              {commonHands.map(({ label, hand }) => (
                <button
                  key={label}
                  onClick={() => {
                    setQuickHandInput(hand);
                    const parsed = parseQuickHand(hand);
                    if (parsed) {
                      setMyHand(parsed);
                      setShowQuickInput(false);
                      setQuickHandInput('');
                    }
                  }}
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 active:bg-green-600/60 text-green-400 rounded-lg font-bold transition-all active:scale-95"
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleQuickHandSubmit}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:from-green-700 active:to-emerald-700 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Set Hand
            </button>

            <div className="mt-4 text-xs text-green-300/60 space-y-1">
              <div>• Type pairs: AA, KK, QQ, etc.</div>
              <div>• Add 's' for suited: AKs, QJs</div>
              <div>• Add 'o' for offsuit: AKo, KQo</div>
              <div>• Or just two cards: AK = AKo</div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-2xl w-full border border-green-500/30 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-400">Keyboard Shortcuts & Help</h3>
              <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-red-500/20 rounded-lg">
                <X className="w-6 h-6 text-red-400" />
              </button>
            </div>

            <div className="space-y-4 text-green-300">
              <div>
                <h4 className="font-bold text-green-400 mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>New Hand</span><kbd className="px-2 py-1 bg-black/50 rounded">N</kbd></div>
                  <div className="flex justify-between"><span>Quick Entry</span><kbd className="px-2 py-1 bg-black/50 rounded">Q</kbd></div>
                  <div className="flex justify-between"><span>Help</span><kbd className="px-2 py-1 bg-black/50 rounded">H or ?</kbd></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-green-400 mb-2">Position Guide</h4>
                <div className="text-sm space-y-1">
                  <div><span className="text-yellow-400 font-bold">BTN</span> - Button (best position)</div>
                  <div><span className="text-green-400 font-bold">CO</span> - Cutoff (2nd best)</div>
                  <div><span className="text-orange-400 font-bold">HJ/MP</span> - Hijack/Middle (OK)</div>
                  <div><span className="text-red-400 font-bold">UTG</span> - Under the Gun (worst)</div>
                  <div><span className="text-blue-400 font-bold">SB</span> - Small Blind</div>
                  <div><span className="text-purple-400 font-bold">BB</span> - Big Blind</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-green-400 mb-2">Quick Tips</h4>
                <div className="text-sm space-y-1">
                  <div>• Fold most hands - it's not boring, it's profitable!</div>
                  <div>• Position matters more than cards sometimes</div>
                  <div>• Each out = ~2% chance to hit (Rule of 2)</div>
                  <div>• On flop, each out = ~4% to hit by river (Rule of 4)</div>
                  <div>• If pot odds match your %, it's break-even</div>
                  <div>• Higher % than pot odds = profitable call</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-3">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-1">
            POKER ADVISOR
          </h1>
        </div>

        {/* Ultra-compact controls */}
        <div className="bg-black/40 backdrop-blur rounded-xl p-3 mb-3 border border-green-500/30">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <select
                value={numPlayers}
                onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                className="px-2 py-1 bg-black/50 text-green-400 rounded border border-green-500/50 text-sm"
              >
                {[2,3,4,5,6,7,8,9].map(n => (<option key={n} value={n}>{n}p</option>))}
              </select>

              <select
                value={myPosition}
                onChange={(e) => setMyPosition(parseInt(e.target.value))}
                className="px-2 py-1 bg-black/50 text-green-400 rounded border border-green-500/50 text-sm"
              >
                {Array.from({length: numPlayers}, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>S{n}</option>
                ))}
              </select>

              <span className="text-green-300 text-xs">#{handNumber}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowQuickInput(true)}
                className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 active:bg-blue-600/70 text-blue-300 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1"
                title="Quick Entry (Q)"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Quick</span>
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="px-3 py-1.5 bg-gray-600/30 hover:bg-gray-600/50 active:bg-gray-600/70 text-gray-300 rounded-lg text-sm font-bold transition-all active:scale-95"
                title="Help (H)"
              >
                ?
              </button>
              <button
                onClick={newHand}
                className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:from-green-700 active:to-emerald-700 text-white font-bold rounded-lg text-sm transition-all active:scale-95 flex items-center gap-1"
                title="New Hand (N)"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* MASSIVE RECOMMENDATION FIRST - Mobile Priority */}
        {recommendation && (
          <div className="mb-3">
            <div className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 backdrop-blur rounded-2xl p-4 sm:p-6 border-4 border-yellow-500/60 shadow-2xl">
              <div className="text-center">
                <div className={`text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${recommendation.actionColor} mb-2 leading-tight`}>
                  {recommendation.action}
                </div>
                <div className="text-lg sm:text-xl text-green-300 mb-3 font-semibold">
                  {recommendation.explanation}
                </div>
                <div className="flex justify-center items-center gap-4 mb-3">
                  <div className={`text-2xl sm:text-3xl font-black ${recommendation.positionColor}`}>
                    {recommendation.position}
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {recommendation.analysis.strength}
                  </div>
                </div>
                <div className="bg-blue-900/30 border-2 border-blue-500/40 rounded-lg p-3">
                  <div className="text-sm sm:text-base text-blue-300">
                    💡 {recommendation.beginnerTip}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Cards Section */}
        <div className="grid grid-cols-1 gap-3 mb-3">
          {/* My Hand - Compact */}
          <div className="bg-black/40 backdrop-blur rounded-xl p-3 border border-green-500/30">
            <h3 className="text-green-400 font-bold mb-2 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              YOUR CARDS
            </h3>
            <div className="flex gap-2 justify-center">
              <CardDisplay
                card={myHand[0]}
                onClick={() => {
                  setPickingCardIndex(0);
                  setPickingCardType('hand');
                  setShowCardPicker(true);
                }}
                label="1"
                size="large"
              />
              <CardDisplay
                card={myHand[1]}
                onClick={() => {
                  setPickingCardIndex(1);
                  setPickingCardType('hand');
                  setShowCardPicker(true);
                }}
                label="2"
                size="large"
              />
            </div>
          </div>

          {/* Board - Ultra Compact */}
          <div className="bg-black/40 backdrop-blur rounded-xl p-3 border border-blue-500/30">
            <h3 className="text-blue-400 font-bold mb-2 text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              BOARD
            </h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {[0, 1, 2, 3, 4].map(idx => (
                <CardDisplay
                  key={idx}
                  card={communityCards[idx]}
                  onClick={() => {
                    setPickingCardIndex(idx);
                    setPickingCardType('community');
                    setShowCardPicker(true);
                  }}
                  label={`${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Betting - Ultra Compact */}
          <div className="bg-black/40 backdrop-blur rounded-xl p-3 border border-purple-500/30">
            <h3 className="text-purple-400 font-bold mb-2 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              POT & BET (BB)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-purple-300 text-xs mb-0.5 block">Pot</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={potSize}
                  onChange={(e) => setPotSize(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-black/50 text-purple-300 rounded-lg border border-purple-500/50 focus:border-purple-400 focus:outline-none text-lg font-bold"
                />
              </div>
              <div>
                <label className="text-purple-300 text-xs mb-0.5 block">To Call</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentBet}
                  onChange={(e) => setCurrentBet(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-black/50 text-purple-300 rounded-lg border border-purple-500/50 focus:border-purple-400 focus:outline-none text-lg font-bold"
                />
              </div>
            </div>
          </div>

          {/* Pot Odds - Only show if relevant */}
          {potOddsDisplay && (
            <div className="bg-black/40 backdrop-blur rounded-xl p-3 border border-cyan-500/30">
              <h3 className="text-cyan-400 font-bold mb-2 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                MATH
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400">You Have</div>
                  <div className={`text-2xl font-bold ${potOddsDisplay.profitable ? 'text-green-400' : 'text-red-400'}`}>
                    {potOddsDisplay.equity}%
                  </div>
                </div>
                <div className="bg-black/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400">You Need</div>
                  <div className="text-2xl font-bold text-gray-300">
                    {potOddsDisplay.potOdds}%
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-2 text-center font-bold text-sm ${
                potOddsDisplay.profitable
                  ? 'bg-green-600/20 border border-green-500/50 text-green-400'
                  : 'bg-red-600/20 border border-red-500/50 text-red-400'
              }`}>
                {potOddsDisplay.profitable ? '✅ CALL PROFITABLE' : '❌ FOLD'}
              </div>
            </div>
          )}

          {/* Outs - Only show if relevant */}
          {recommendation && recommendation.analysis.outs.length > 0 && (
            <div className="bg-black/40 backdrop-blur rounded-xl p-3 border border-cyan-500/30">
              <h3 className="text-cyan-400 font-bold mb-2 text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                OUTS: {recommendation.analysis.totalOuts}
              </h3>
              <div className="space-y-2">
                {recommendation.analysis.outs.map((out, idx) => (
                  <div key={idx} className="bg-black/50 rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{out.icon}</span>
                      <span className="text-cyan-300 text-sm">{out.type}</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">{out.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* No cards placeholder */}
        {!recommendation && (
          <div className="bg-black/40 backdrop-blur rounded-2xl p-8 border border-gray-700/50 text-center">
            <Zap className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
            <p className="text-green-400 text-lg mb-2">Press Q for Quick Entry</p>
            <p className="text-green-300/60 text-sm">or tap cards to select</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
