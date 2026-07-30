/* ==========================================================================
   Seeds one sample published article so the blog isn't empty on first run.

     npm run seed
   ========================================================================== */
require('dotenv').config();

const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const User      = require('../models/User');
const Post      = require('../models/Post');

const SAMPLE = {
  title: 'Why FRP Gratings Outlast Steel in Chemical Plants',
  tags: ['frp', 'gratings', 'corrosion'],
  status: 'published',
  excerpt:
    'Galvanised steel walkways in acid splash zones need recoating every few years. Molded FRP gratings do not corrode at all — here is the engineering behind that.',
  content: `
<p>Walkways and platforms in chemical processing plants sit in the harshest environment on site: acid mist, caustic washdown, and constant humidity. Galvanised steel survives it for a while. Composite gratings survive it indefinitely.</p>

<h2>Corrosion is a material property, not a coating</h2>
<p>Galvanising protects steel sacrificially — the zinc layer corrodes so the steel underneath does not. Once that layer is consumed, usually far sooner in a low-pH atmosphere than the datasheet suggests, the substrate is exposed and section loss begins.</p>
<p>Molded FRP has no sacrificial layer because it has nothing to protect. The glass reinforcement is fully encapsulated in an isophthalic or vinyl ester resin matrix that is chemically inert to the acids, alkalis and solvents found in process plants.</p>

<h2>Where vinyl ester earns its cost</h2>
<ul>
  <li><strong>Isophthalic polyester</strong> — general plant walkways, water treatment decks, moderate chemical exposure.</li>
  <li><strong>Vinyl ester</strong> — acid splash zones, chlorine handling, offshore and marine platforms.</li>
  <li><strong>Fire-retardant grades</strong> — ASTM E84 Class 1, flame spread index below 25, for enclosed plant areas.</li>
</ul>

<h2>The safety case</h2>
<p>FRP is 100% non-conductive, which removes the ground-fault risk that steel walkways introduce near switchgear and cable runs. The quartz grit top bonded during molding gives permanent anti-slip friction — unlike painted steel grip surfaces, it does not wear smooth or need reapplying.</p>

<blockquote>A 75% weight reduction against steel means panels are carried and cut on site by hand, without cranes or hot work permits.</blockquote>

<h2>Total cost over 30 years</h2>
<p>FRP typically carries a higher purchase price per square metre than galvanised steel and a lower one than stainless. The difference shows up in what happens after installation: no recoating cycles, no corrosion inspections, no section-loss replacement, and no shutdown time to do any of it.</p>

<p>For a spec against your own load, span and chemical exposure, send us the details and our engineers will size the panel for you.</p>
`.trim(),
};

(async function run() {
  await connectDB();

  const admin = await User.findOne().sort({ createdAt: 1 });
  if (!admin) {
    console.error('\n  No admin user found. Run: npm run create-admin -- <user> <pass> "Name"\n');
    process.exit(1);
  }

  const existing = await Post.findOne({ title: SAMPLE.title });
  if (existing) {
    console.log('\n  Sample post already present — nothing to do.\n');
  } else {
    await Post.create({
      ...SAMPLE,
      slug: await Post.uniqueSlug(SAMPLE.title),
      author: admin._id,
    });
    console.log('\n  Sample article seeded.\n');
  }

  await mongoose.disconnect();
})();
