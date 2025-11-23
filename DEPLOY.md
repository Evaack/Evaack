# 🌐 Deploy Your Poker Advisor (2 Minutes!)

## 🚀 **Easiest Method: Vercel (Recommended)**

### Step 1: Push your code to GitHub
```bash
# Already done! Your code is on GitHub at:
# https://github.com/Evaack/Evaack
```

### Step 2: Deploy to Vercel (FREE Forever)

1. **Go to:** https://vercel.com/signup
2. **Sign up** with your GitHub account (1 click)
3. **Click:** "Import Project" or "New Project"
4. **Select:** Your `Evaack/Evaack` repository
5. **Click:** "Deploy" (don't change any settings!)
6. **Wait 30 seconds...**
7. **Done!** You'll get a URL like: `https://evaack.vercel.app`

### Step 3: Bookmark It!
- Bookmark the URL on your PC
- Bookmark it on your phone
- Now you can access it ANYWHERE, ANYTIME! 🎉

---

## 🔄 **Auto-Updates**

Every time you push to GitHub, Vercel automatically redeploys!
```bash
# Make changes, then:
git add -A
git commit -m "Updated poker advisor"
git push

# Vercel rebuilds automatically - your site updates in 30 seconds!
```

---

## 🎯 **Alternative: Netlify (Also Free)**

1. Go to: https://app.netlify.com/start
2. Sign up with GitHub
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy"

You'll get a URL like: `https://evaack.netlify.app`

---

## 📱 **Alternative: GitHub Pages (Free but slower)**

1. Update `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/Evaack/',  // Add this line
  server: {
    host: true,
    port: 5173
  }
})
```

2. Run these commands:
```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

3. Enable GitHub Pages in your repo settings
4. Your site will be at: `https://evaack.github.io/Evaack/`

---

## 🎰 **What You Get**

After deployment:
- ✅ A permanent URL you can bookmark
- ✅ Access from ANY device (PC, phone, tablet)
- ✅ No need to run `npm start` ever again
- ✅ Auto-updates when you push to GitHub
- ✅ Lightning-fast CDN hosting
- ✅ FREE forever (on free tier)
- ✅ Share with friends!

---

## 🏆 **Recommended: Use Vercel**

Why? Because:
- Literally 2 minutes to set up
- Zero configuration needed
- Automatic HTTPS
- Instant deploys
- Best performance
- Custom domain support (optional)

---

## 💡 **Usage After Deployment**

**While playing poker:**
1. Open the Vercel URL in your browser
2. Bookmark it for instant access
3. Use it just like before - but no need to run npm start!

**On your phone:**
- You can even use the same URL on your phone
- Add to home screen for app-like experience

**On your PC:**
- Just bookmark the URL
- Open it whenever you play poker
- No terminal, no npm, just click and go!

---

## 🎉 **Next Steps**

1. Deploy to Vercel (2 minutes)
2. Bookmark the URL
3. Play poker and crush it!

**Questions? The Vercel setup is so simple you won't need help, but let me know if anything comes up!**
