"""FSBO tweet content generator.

Generates tweets about FSBO home selling: facts, savings, market data,
state-specific info, and tips. Pulls from a curated pool so content
doesn't repeat.
"""

import random
from datetime import datetime
from zoneinfo import ZoneInfo

SITE_URL = "firstdoorkey.com"

# --- Tweet pools ---
# Each pool has templates. {state}, {price}, {savings}, {pct} get filled randomly.

STATES_DATA = {
    "Alabama": 230000, "Alaska": 365000, "Arizona": 410000, "Arkansas": 195000,
    "California": 785000, "Colorado": 535000, "Connecticut": 380000, "Delaware": 350000,
    "Florida": 400000, "Georgia": 320000, "Hawaii": 890000, "Idaho": 450000,
    "Illinois": 265000, "Indiana": 240000, "Iowa": 210000, "Kansas": 225000,
    "Kentucky": 210000, "Louisiana": 195000, "Maine": 355000, "Maryland": 395000,
    "Massachusetts": 585000, "Michigan": 235000, "Minnesota": 330000,
    "Mississippi": 175000, "Missouri": 240000, "Montana": 450000, "Nebraska": 255000,
    "Nevada": 425000, "New Hampshire": 445000, "New Jersey": 490000,
    "New Mexico": 290000, "New York": 420000, "North Carolina": 325000,
    "North Dakota": 250000, "Ohio": 210000, "Oklahoma": 195000, "Oregon": 480000,
    "Pennsylvania": 265000, "Rhode Island": 415000, "South Carolina": 295000,
    "South Dakota": 295000, "Tennessee": 310000, "Texas": 300000, "Utah": 485000,
    "Vermont": 380000, "Virginia": 380000, "Washington": 580000,
    "West Virginia": 145000, "Wisconsin": 280000, "Wyoming": 330000,
}

SAVINGS_FACTS = [
    "The average real estate commission is 5-6%. On a ${price:,} home in {state}, that's ${savings:,} you could keep by selling FSBO.",
    "Selling FSBO in {state}? The median home is ${price:,}. Skip the agent and save up to ${savings:,} in commissions.",
    "{state} homeowners: your median home value is ${price:,}. A 5% commission = ${savings:,} gone. FSBO keeps that in your pocket.",
    "In {state}, the median home sells for ${price:,}. That's ${savings:,} in agent commissions you don't have to pay if you sell yourself.",
    "A {state} homeowner selling a ${price:,} home FSBO saves approximately ${savings:,} compared to using a full-service agent.",
    "Did you know? In {state}, selling your ${price:,} home without an agent could save you ${savings:,}. That's a new car.",
]

FSBO_FACTS = [
    "FSBO sales represent about 6% of all US home sales — roughly 420,000 transactions per year worth $84 billion.",
    "After the 2024 NAR settlement, sellers no longer have to pay the buyer's agent commission. Game changer for FSBO sellers.",
    "The #1 cause of FSBO lawsuits? Failing to disclose known defects. Always fill out your state's property disclosure form completely.",
    "Professional photos are the highest-ROI expense in FSBO selling. Listings with pro photos sell 32% faster and for $3,000-$11,000 more.",
    "A flat-fee MLS listing ($100-$500) gets your home on Zillow, Realtor.com, Redfin, and Trulia. Same exposure as a $20,000 agent.",
    "FSBO tip: price your home within 3% of market value. Overpriced homes sit longer and ultimately sell for less than properly priced ones.",
    "Total FSBO closing costs on a $400K home: $3,000-$8,000. Compare that to $20,000-$24,000 in traditional agent commissions.",
    "Earnest money is typically 1-3% of the sale price. It's held in escrow and applied to the buyer's down payment at closing.",
    "23% of conventional loans now use appraisal waivers — no in-person appraisal needed. This speeds up the FSBO closing process.",
    "The best time to list FSBO? Late spring (April-May). Homes listed in spring sell for 5-10% more than winter listings on average.",
    "FSBO sellers who hire a real estate attorney ($500-$1,500) avoid 90% of the legal risks that scare people away from selling themselves.",
    "Since August 2024, buyers must sign written buyer-broker agreements before touring homes. This changed the commission game entirely.",
    "Want to sell FSBO but worried about showings? Use a lockbox + showing service ($50-100/month) for scheduled, secure access.",
    "The median FSBO sale takes about the same time as agent-listed homes when the home is properly priced and on the MLS.",
    "Lead paint disclosure is federally required for ALL homes built before 1978. No exceptions, even in 'buyer beware' states.",
]

MARKET_FACTS = [
    "Mortgage rates are hovering near {rate}% in 2026. Every 1% increase in rates reduces buying power by about 10%.",
    "Housing inventory has been climbing in 2026, giving FSBO sellers more competition — but also more buyers actively looking.",
    "The median US home price hit $420,000 in 2026. At 5% commission, that's $21,000 in agent fees. FSBO saves most of that.",
    "Cash buyers now account for ~30% of home purchases. FSBO sellers benefit — cash deals close faster with fewer contingencies.",
    "Home prices rose 4-5% nationally in the past year. If you bought 5+ years ago, your equity gain makes FSBO savings even larger.",
    "New construction is up 8% in 2026, adding competition for resale homes. Proper pricing is more important than ever for FSBO sellers.",
    "The average home sits on market for 45-60 days in 2026. Proper pricing and MLS exposure can cut that to 20-30 days.",
    "Remote work continues to shift demand. Suburban and rural FSBO sellers are seeing stronger buyer interest than pre-2020.",
]

STATE_SPECIFIC = [
    "Florida has no state income tax, making it a top destination for homebuyers. FSBO sellers in FL benefit from strong demand.",
    "Texas has some of the highest property tax rates (1.6-2.2%) but no state income tax. Factor this into your FSBO pricing.",
    "California's median home price is $785,000 — a 5% commission is $39,250. FSBO savings are massive in high-cost states.",
    "New York requires an attorney at closing. Budget $1,000-$2,000 but you'll still save $15,000+ vs. agent commissions.",
    "In Colorado, sellers must provide a 'Seller's Property Disclosure' within 5 days of contract execution. Know your deadlines.",
    "Georgia is an attorney state — you need a lawyer at closing. Still saves $10,000+ compared to full agent commissions.",
    "Hawaii's median home price is $890,000. That's $44,500 in potential agent commissions. FSBO makes the most sense in expensive markets.",
    "Washington state has no income tax but one of the highest real estate excise taxes (1.1-3%). Build this into your FSBO net proceeds.",
    "In Illinois, transfer taxes can run $1,500-$3,000 on a median home. FSBO still saves $10,000+ in commissions even after taxes.",
    "North Carolina saw 15% population growth since 2020. Strong buyer demand = great conditions for FSBO sellers.",
    "Montana's housing market is booming — median price jumped to $450,000. FSBO savings of $22,500 make a real difference.",
    "Pennsylvania FSBO sellers: no requirement for an attorney at closing, but strongly recommended ($500-$1,000).",
    "Tennessee has no state income tax and median home prices of $310,000. FSBO can save you $15,500 in commissions.",
    "Arizona's hot market means FSBO homes get serious buyer traffic. Median price: $410,000, potential savings: $20,500.",
    "West Virginia has the lowest median home price ($145,000) — but FSBO still saves you $7,250 in commissions.",
]

TIPS = [
    "FSBO tip: Get a pre-listing home inspection ($300-500). Fix issues before buyers find them. Eliminates 80% of negotiation headaches.",
    "Pricing strategy: look at the last 3-6 months of comparable sales within 0.5 miles. Don't use Zestimates — they're off by 5-10%.",
    "Stage your home for photos. Declutter, deep clean, add fresh flowers. Staged homes sell 73% faster according to NAR data.",
    "Never accept a verbal offer. Everything in writing. Use your state's standard purchase agreement or hire an attorney to draft one.",
    "Open houses generate buzz but only account for 2-4% of actual sales. Focus on private showings scheduled through MLS inquiries.",
    "FSBO negotiation tip: respond to every offer in writing within 24 hours, even if it's a counter. Silence kills deals.",
    "Consider offering a home warranty ($400-600) to the buyer. It reduces post-sale liability and makes your listing more competitive.",
    "Title insurance protects both you and the buyer. Owner's policy costs $1,000-$2,000. In many states, it's the seller's responsibility.",
    "Drone photography ($100-200 extra) is worth it for homes with large lots, waterfront views, or desirable neighborhoods.",
    "Use a showing feedback form. Ask every buyer's agent what their client thought. Adjust price or staging based on patterns.",
]

ALL_POOLS = {
    "savings": SAVINGS_FACTS,
    "facts": FSBO_FACTS,
    "market": MARKET_FACTS,
    "state": STATE_SPECIFIC,
    "tips": TIPS,
}

HASHTAG_MAP = {
    "savings": ["#FSBO", "#RealEstate", "#HomeSelling", "#SaveMoney"],
    "facts": ["#FSBO", "#RealEstate", "#HomeSelling", "#RealEstateTips"],
    "market": ["#FSBO", "#HousingMarket", "#RealEstate", "#MortgageRates"],
    "state": ["#FSBO", "#RealEstate", "#HomeSelling", "#HomeOwnership"],
    "tips": ["#FSBO", "#RealEstate", "#HomeSelling", "#FSBOTips"],
}


def generate_tweet(posted_hashes: set[int], promo: bool = False) -> tuple[str, str, int]:
    """Generate a unique tweet. Returns (tweet_text, category, content_hash)."""
    max_attempts = 50
    for _ in range(max_attempts):
        category = random.choice(list(ALL_POOLS.keys()))
        template = random.choice(ALL_POOLS[category])

        # Fill in state/price data if needed
        if "{state}" in template or "{price" in template:
            state = random.choice(list(STATES_DATA.keys()))
            price = STATES_DATA[state]
            savings = int(price * 0.05)
            content = template.format(state=state, price=price, savings=savings)
        elif "{rate}" in template:
            rate = random.choice(["6.5", "6.7", "6.8", "7.0", "6.9"])
            content = template.format(rate=rate)
        else:
            content = template

        content_hash = hash(content)
        if content_hash in posted_hashes:
            continue

        # Build hashtags
        tags = HASHTAG_MAP.get(category, ["#FSBO", "#RealEstate"])
        tag_str = " ".join(tags)

        if promo:
            footer = f"\n\nLearn more at {SITE_URL}\n{tag_str}"
        else:
            footer = f"\n\n{tag_str}"

        tweet = f"{content}{footer}"

        # Trim if over 280
        if len(tweet) > 280:
            over = len(tweet) - 280
            content = content[:-(over + 3)].rstrip() + "..."
            tweet = f"{content}{footer}"

        if len(tweet) <= 280:
            return tweet, category, content_hash

    # Fallback
    tweet = f"Thinking about selling your home yourself? FSBO can save thousands in agent commissions.\n\n#FSBO #RealEstate"
    return tweet, "facts", hash(tweet)
