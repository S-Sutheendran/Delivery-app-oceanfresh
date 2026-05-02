"""
Seed script for OceanFresh — 100 seafood products across 9 categories.
Run: python seed_data.py
"""
from database import SessionLocal, engine, Base
from models import Category, Product

Base.metadata.create_all(bind=engine)

# Consistent image size 400×400 via picsum with deterministic seeds
def img(seed: str) -> str:
    return f"https://picsum.photos/seed/{seed}/400/400"


CATEGORIES = [
    {"id": 1, "name": "Fish",          "emoji": "🐟", "image_url": img("cat_fish")},
    {"id": 2, "name": "Shrimp",        "emoji": "🦐", "image_url": img("cat_shrimp")},
    {"id": 3, "name": "Crab",          "emoji": "🦀", "image_url": img("cat_crab")},
    {"id": 4, "name": "Lobster",       "emoji": "🦞", "image_url": img("cat_lobster")},
    {"id": 5, "name": "Squid",         "emoji": "🦑", "image_url": img("cat_squid")},
    {"id": 6, "name": "Oysters",       "emoji": "🦪", "image_url": img("cat_oyster")},
    {"id": 7, "name": "Smoked",        "emoji": "🔥", "image_url": img("cat_smoked")},
    {"id": 8, "name": "Frozen",        "emoji": "❄️", "image_url": img("cat_frozen")},
    {"id": 9, "name": "Ready-to-Cook", "emoji": "🍳", "image_url": img("cat_rtc")},
]

PRODUCTS = [
    # ── FISH (cat 1) ─────────────────────────────────────────────────────────
    {"id":1,  "name":"Atlantic Salmon Fillet",       "cat":1, "price":749,  "orig":899,  "rating":4.8, "rev":1240, "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Norway",         "tip":"Pan-sear skin-side down for crispy skin. Cook 3–4 min per side."},
    {"id":2,  "name":"Wild-Caught Tuna Steak",       "cat":1, "price":899,  "orig":1099, "rating":4.7, "rev":980,  "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Indian Ocean",   "tip":"Sear on high heat 2 min each side for a perfect medium-rare."},
    {"id":3,  "name":"Sea Bass (Whole)",             "cat":1, "price":549,  "orig":None, "rating":4.6, "rev":760,  "bs":False, "tr":True,  "sea":True,  "unit":"per kg",   "origin":"Mediterranean",  "tip":"Stuff with lemon and herbs, then grill for 20 minutes."},
    {"id":4,  "name":"Red Snapper Fillet",           "cat":1, "price":649,  "orig":None, "rating":4.5, "rev":540,  "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"Kerala",         "tip":"Great for a spicy Kerala fish curry."},
    {"id":5,  "name":"Pomfret (Whole)",              "cat":1, "price":449,  "orig":499,  "rating":4.7, "rev":1100, "bs":True,  "tr":True,  "sea":False, "unit":"per kg",   "origin":"Arabian Sea",    "tip":"Marinate with turmeric & chilli, shallow fry until golden."},
    {"id":6,  "name":"Rohu Fish (Cleaned)",          "cat":1, "price":299,  "orig":None, "rating":4.3, "rev":890,  "bs":True,  "tr":False, "sea":False, "unit":"per kg",   "origin":"West Bengal",    "tip":"Perfect for Bengali shorshe maach (mustard fish curry)."},
    {"id":7,  "name":"Hilsa Fish (Ilish)",           "cat":1, "price":999,  "orig":None, "rating":4.9, "rev":2100, "bs":True,  "tr":True,  "sea":True,  "unit":"per kg",   "origin":"Bangladesh",     "tip":"Steam in banana leaf with mustard paste for authentic taste."},
    {"id":8,  "name":"Mackerel (Bangda)",            "cat":1, "price":249,  "orig":None, "rating":4.4, "rev":670,  "bs":False, "tr":False, "sea":False, "unit":"per kg",   "origin":"Konkan Coast",   "tip":"Pan fry with Goan masala for a quick and flavourful meal."},
    {"id":9,  "name":"Surmai (King Mackerel) Steak", "cat":1, "price":699,  "orig":799,  "rating":4.6, "rev":820,  "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Mumbai",         "tip":"Tawa-fry with recheado masala. A Goan classic."},
    {"id":10, "name":"Catla Fish (Whole)",           "cat":1, "price":329,  "orig":None, "rating":4.2, "rev":560,  "bs":False, "tr":False, "sea":False, "unit":"per kg",   "origin":"Andhra Pradesh", "tip":"Best in spicy Andhra style fish curry with tamarind."},
    {"id":11, "name":"Rawas (Indian Salmon) Fillet", "cat":1, "price":599,  "orig":699,  "rating":4.5, "rev":730,  "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"Mumbai",         "tip":"Marinate in yoghurt and spices, then bake at 200°C."},
    {"id":12, "name":"Tilapia Fillet",               "cat":1, "price":399,  "orig":None, "rating":4.1, "rev":440,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Andhra Pradesh", "tip":"Neutral flavour absorbs any spice blend beautifully."},
    {"id":13, "name":"Barramundi (Bhetki) Fillet",   "cat":1, "price":799,  "orig":999,  "rating":4.7, "rev":910,  "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Bay of Bengal",  "tip":"Pan-sear and serve with a lemon butter sauce."},
    {"id":14, "name":"Sardines (Mathi)",             "cat":1, "price":199,  "orig":None, "rating":4.3, "rev":380,  "bs":False, "tr":False, "sea":True,  "unit":"per kg",   "origin":"Kerala",         "tip":"Fry with Kerala-style masala or make a spicy masala sardine curry."},
    {"id":15, "name":"Sole Fish (Leppu)",            "cat":1, "price":549,  "orig":None, "rating":4.4, "rev":490,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Mangalore",      "tip":"Best in Mangalorean style fish curry with coconut milk."},
    {"id":16, "name":"Grouper Fillet",               "cat":1, "price":849,  "orig":1049, "rating":4.5, "rev":610,  "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"Lakshadweep",    "tip":"Steam in soy-ginger sauce for a light and healthy meal."},
    {"id":17, "name":"Shark Fillet",                 "cat":1, "price":449,  "orig":None, "rating":4.0, "rev":310,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Tamil Nadu",     "tip":"Make sura puttu — a Tamil Nadu delicacy with crumbled shark."},
    {"id":18, "name":"Mahi-Mahi (Dolphinfish)",      "cat":1, "price":749,  "orig":None, "rating":4.6, "rev":680,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Indian Ocean",   "tip":"Grill with garlic butter and fresh herbs."},
    {"id":19, "name":"Mullet Fish (Kalimeen)",       "cat":1, "price":349,  "orig":None, "rating":4.3, "rev":420,  "bs":False, "tr":False, "sea":False, "unit":"per kg",   "origin":"Kerala",         "tip":"Shallow fry or make a coconut-milk curry."},
    {"id":20, "name":"Butter Fish (Murrel/Snakehead)","cat":1,"price":599,  "orig":None, "rating":4.4, "rev":510,  "bs":False, "tr":False, "sea":True,  "unit":"per 500g", "origin":"Karnataka",      "tip":"Deep fry with semolina coating for the crispiest fish fry."},

    # ── SHRIMP (cat 2) ──────────────────────────────────────────────────────
    {"id":21, "name":"Tiger Prawns (Large)",         "cat":2, "price":899,  "orig":1099, "rating":4.8, "rev":1560, "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Bay of Bengal",  "tip":"Marinate in garlic-butter and grill for 3 min each side."},
    {"id":22, "name":"Vannamei Shrimp (Medium)",     "cat":2, "price":599,  "orig":699,  "rating":4.5, "rev":1230, "bs":True,  "tr":False, "sea":False, "unit":"per 500g", "origin":"Andhra Pradesh", "tip":"Toss in a spicy Indo-Chinese sauce for a quick starter."},
    {"id":23, "name":"Jumbo King Prawns",            "cat":2, "price":1299, "orig":1599, "rating":4.9, "rev":2200, "bs":True,  "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Gulf of Mannar", "tip":"Butterfly and stuff with herb cream cheese. Bake at 200°C."},
    {"id":24, "name":"Small Baby Shrimp",            "cat":2, "price":399,  "orig":None, "rating":4.2, "rev":580,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"West Bengal",    "tip":"Perfect for prawn biryani or fried rice."},
    {"id":25, "name":"Dried Prawn (Kolambi)",        "cat":2, "price":349,  "orig":None, "rating":4.4, "rev":760,  "bs":True,  "tr":False, "sea":False, "unit":"per 200g", "origin":"Ratnagiri",      "tip":"Use as a flavour booster in chutneys and coastal curries."},
    {"id":26, "name":"Rock Lobster Tail (Prawn)",    "cat":2, "price":1499, "orig":None, "rating":4.8, "rev":940,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Andaman Islands","tip":"Split and grill with garlic-herb butter. A restaurant-worthy dish."},
    {"id":27, "name":"Prawn (Devein & Cleaned)",     "cat":2, "price":549,  "orig":None, "rating":4.3, "rev":1120, "bs":True,  "tr":False, "sea":False, "unit":"per 500g", "origin":"Chennai",        "tip":"Ready for any recipe — just add your favourite masala."},
    {"id":28, "name":"Freshwater Prawn (Galda)",     "cat":2, "price":699,  "orig":None, "rating":4.6, "rev":870,  "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"Kolkata",        "tip":"Slow cook in coconut milk with mustard seeds for a Bengali treat."},
    {"id":29, "name":"Prawn Pickled in Oil",         "cat":2, "price":299,  "orig":None, "rating":4.1, "rev":330,  "bs":False, "tr":False, "sea":False, "unit":"per 200g", "origin":"Goa",            "tip":"Ready-to-eat Goan prawn balchão. Serve with pav."},
    {"id":30, "name":"Scampi (Dublin Bay Prawn)",    "cat":2, "price":1199, "orig":1499, "rating":4.7, "rev":660,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Imported",       "tip":"Sauté in white wine, garlic and butter. Serve with crusty bread."},

    # ── CRAB (cat 3) ────────────────────────────────────────────────────────
    {"id":31, "name":"Mud Crab (Whole)",             "cat":3, "price":799,  "orig":999,  "rating":4.7, "rev":1080, "bs":True,  "tr":True,  "sea":False, "unit":"per kg",   "origin":"Sundarbans",     "tip":"Steam and crack open. Serve with melted butter and lemon."},
    {"id":32, "name":"Blue Crab (Cleaned Halves)",   "cat":3, "price":699,  "orig":None, "rating":4.6, "rev":780,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Chilika Lake",   "tip":"Stir-fry with black pepper sauce for a stunning Chinese-style dish."},
    {"id":33, "name":"Soft Shell Crab",              "cat":3, "price":1099, "orig":1299, "rating":4.8, "rev":1200, "bs":True,  "tr":True,  "sea":True,  "unit":"per 4 pcs","origin":"Coastal Odisha",  "tip":"Coat in light batter and deep-fry. Serve as a burger patty!"},
    {"id":34, "name":"Crab Claws (Cooked)",          "cat":3, "price":999,  "orig":None, "rating":4.5, "rev":640,  "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"Kerala",         "tip":"Already cooked — reheat in butter sauce and serve immediately."},
    {"id":35, "name":"Snow Crab Legs",               "cat":3, "price":1699, "orig":2099, "rating":4.9, "rev":1480, "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Imported",       "tip":"Steam for 5 minutes. Crack open and dip in drawn butter."},
    {"id":36, "name":"Dungeness Crab (Whole)",       "cat":3, "price":1499, "orig":None, "rating":4.7, "rev":820,  "bs":False, "tr":True,  "sea":True,  "unit":"per kg",   "origin":"Imported",       "tip":"Boil with Old Bay seasoning and corn on the cob."},
    {"id":37, "name":"Crab Meat (Picked)",           "cat":3, "price":899,  "orig":None, "rating":4.4, "rev":590,  "bs":False, "tr":False, "sea":False, "unit":"per 250g", "origin":"Tamil Nadu",     "tip":"Use in crab cakes, pasta, or crab fried rice."},
    {"id":38, "name":"Kerala Kadal Njandu Curry Cut","cat":3, "price":649,  "orig":None, "rating":4.6, "rev":710,  "bs":True,  "tr":False, "sea":False, "unit":"per 500g", "origin":"Trivandrum",     "tip":"Pre-cut for easy curry making. Add coconut milk for richness."},
    {"id":39, "name":"Spider Crab (Whole)",          "cat":3, "price":1199, "orig":None, "rating":4.3, "rev":320,  "bs":False, "tr":False, "sea":True,  "unit":"per kg",   "origin":"Andaman Islands","tip":"Steam whole and serve with aioli and lemon wedges."},
    {"id":40, "name":"Crab Masala Paste (Ready)",    "cat":3, "price":249,  "orig":None, "rating":4.2, "rev":280,  "bs":False, "tr":False, "sea":False, "unit":"per 200g", "origin":"Goa",            "tip":"Authentic Goan crab xacuti paste. Just add the crab."},
    {"id":41, "name":"Horseshoe Crab Roe",           "cat":3, "price":549,  "orig":None, "rating":4.0, "rev":190,  "bs":False, "tr":False, "sea":True,  "unit":"per 150g", "origin":"Odisha",         "tip":"Pan fry with onions and green chillies for a delicacy."},
    {"id":42, "name":"Mangrove Crab Curry Cut",      "cat":3, "price":549,  "orig":None, "rating":4.4, "rev":460,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Sundarbans",     "tip":"Best cooked in a coconut-based Mangalorean curry."},
    {"id":43, "name":"Rock Crab (Whole)",            "cat":3, "price":599,  "orig":None, "rating":4.3, "rev":410,  "bs":False, "tr":False, "sea":False, "unit":"per kg",   "origin":"Goa",            "tip":"Grill with butter and garlic for a coastal feast."},
    {"id":44, "name":"Peekytoe Crab (Cleaned)",      "cat":3, "price":899,  "orig":None, "rating":4.5, "rev":360,  "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"Imported",       "tip":"Light and sweet — perfect for salads and pasta."},
    {"id":45, "name":"Blue Swimmer Crab (Whole)",    "cat":3, "price":749,  "orig":None, "rating":4.6, "rev":830,  "bs":True,  "tr":True,  "sea":True,  "unit":"per kg",   "origin":"Chennai",        "tip":"Make a classic pepper crab for a restaurant experience at home."},

    # ── LOBSTER (cat 4) ─────────────────────────────────────────────────────
    {"id":46, "name":"Live Spiny Lobster",           "cat":4, "price":2499, "orig":None, "rating":4.9, "rev":1800, "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Lakshadweep",    "tip":"Split and grill. The freshest way to enjoy premium lobster."},
    {"id":47, "name":"Lobster Tail (Frozen)",        "cat":4, "price":1799, "orig":2199, "rating":4.7, "rev":1100, "bs":True,  "tr":True,  "sea":False, "unit":"per 250g", "origin":"Sri Lanka",      "tip":"Butterfly and broil with lemon-herb butter for 8–10 min."},
    {"id":48, "name":"Whole Cooked Lobster",         "cat":4, "price":2199, "orig":None, "rating":4.8, "rev":940,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Indian Ocean",   "tip":"Ready to eat — crack open and enjoy with garlic mayo."},
    {"id":49, "name":"Lobster Bisque (Ready-to-Cook)","cat":4,"price":699,  "orig":None, "rating":4.5, "rev":560,  "bs":False, "tr":False, "sea":False, "unit":"per 400ml","origin":"Imported",       "tip":"Reheat gently, add cream and a splash of brandy."},
    {"id":50, "name":"Lobster Medallions",           "cat":4, "price":1599, "orig":None, "rating":4.7, "rev":720,  "bs":False, "tr":True,  "sea":True,  "unit":"per 250g", "origin":"Andaman Islands","tip":"Sauté briefly in clarified butter. Do not overcook."},
    {"id":51, "name":"Rock Lobster Whole",           "cat":4, "price":2299, "orig":None, "rating":4.8, "rev":1020, "bs":False, "tr":True,  "sea":False, "unit":"per 500g", "origin":"South Africa",   "tip":"Steam or boil in salted water. Serve with thermidor sauce."},
    {"id":52, "name":"Lobster Claw Meat",            "cat":4, "price":1899, "orig":None, "rating":4.6, "rev":830,  "bs":False, "tr":True,  "sea":False, "unit":"per 250g", "origin":"Canada",         "tip":"Perfect for lobster rolls. Mix with mayo, celery, and lemon."},
    {"id":53, "name":"Baby Lobster (Langoustine)",   "cat":4, "price":1299, "orig":None, "rating":4.7, "rev":660,  "bs":True,  "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Norway",         "tip":"Grill and serve with aioli. A Michelin-worthy experience."},
    {"id":54, "name":"Lobster Thermidor Mix",        "cat":4, "price":999,  "orig":None, "rating":4.5, "rev":490,  "bs":False, "tr":False, "sea":False, "unit":"per 400g", "origin":"Imported",       "tip":"Pre-portioned for classic thermidor. Add gruyère and broil."},
    {"id":55, "name":"Slipper Lobster (Thekkam)",    "cat":4, "price":1099, "orig":None, "rating":4.4, "rev":380,  "bs":False, "tr":False, "sea":True,  "unit":"per 500g", "origin":"Tamil Nadu",     "tip":"Sauté with coconut and spice for a South Indian feast."},

    # ── SQUID / OCTOPUS (cat 5) ──────────────────────────────────────────────
    {"id":56, "name":"Squid Rings (Cleaned)",        "cat":5, "price":549,  "orig":649,  "rating":4.6, "rev":1040, "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Mumbai",         "tip":"Coat in seasoned flour and fry 2 min until golden. Don't overcook."},
    {"id":57, "name":"Whole Squid (Calamari)",       "cat":5, "price":449,  "orig":None, "rating":4.4, "rev":720,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Konkan",         "tip":"Stuff with prawn masala and slow-cook in tomato sauce."},
    {"id":58, "name":"Baby Squid",                   "cat":5, "price":499,  "orig":None, "rating":4.5, "rev":610,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Kerala",         "tip":"Toss in a wok with soy sauce, ginger, and spring onions."},
    {"id":59, "name":"Octopus (Cleaned Whole)",      "cat":5, "price":799,  "orig":None, "rating":4.6, "rev":870,  "bs":True,  "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Mediterranean",  "tip":"Boil with wine cork for 45 min, then grill with olive oil."},
    {"id":60, "name":"Octopus Tentacles",            "cat":5, "price":899,  "orig":None, "rating":4.7, "rev":940,  "bs":False, "tr":True,  "sea":True,  "unit":"per 500g", "origin":"Spain",          "tip":"Char-grill and serve on patatas bravas — Galician style!"},
    {"id":61, "name":"Cuttlefish (Sepia)",           "cat":5, "price":499,  "orig":None, "rating":4.3, "rev":540,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Goa",            "tip":"Cook in its own ink with onion and tomatoes for a dramatic dish."},
    {"id":62, "name":"Squid Ink Pasta Set",          "cat":5, "price":699,  "orig":None, "rating":4.5, "rev":460,  "bs":False, "tr":True,  "sea":False, "unit":"per 400g", "origin":"Italy",          "tip":"Ready-to-use kit for authentic Italian squid ink pasta at home."},
    {"id":63, "name":"Dried Squid (Sundried)",       "cat":5, "price":299,  "orig":None, "rating":4.1, "rev":320,  "bs":False, "tr":False, "sea":False, "unit":"per 200g", "origin":"Ratnagiri",      "tip":"Roast over open flame and serve with green chutney."},
    {"id":64, "name":"Stuffed Squid (Ready-to-Cook)","cat":5, "price":599,  "orig":None, "rating":4.4, "rev":380,  "bs":False, "tr":False, "sea":True,  "unit":"per 3 pcs","origin":"Mumbai",          "tip":"Bake at 190°C for 20 minutes. Stuff is already seasoned."},
    {"id":65, "name":"Flying Fish Roe",              "cat":5, "price":349,  "orig":None, "rating":4.2, "rev":280,  "bs":False, "tr":False, "sea":False, "unit":"per 100g", "origin":"Japan",          "tip":"Top sushi rolls or use as a fancy garnish for fish dishes."},

    # ── OYSTERS / SHELLFISH (cat 6) ──────────────────────────────────────────
    {"id":66, "name":"Pacific Oysters (Live, Half Shell)","cat":6,"price":999,"orig":None,"rating":4.8,"rev":1200,"bs":True,  "tr":True,  "sea":True,  "unit":"per 6 pcs","origin":"Goa",            "tip":"Serve immediately on crushed ice with mignonette sauce."},
    {"id":67, "name":"Rock Oysters (Frozen Shucked)", "cat":6,"price":799,  "orig":None, "rating":4.6, "rev":880,  "bs":False, "tr":True,  "sea":False, "unit":"per 200g", "origin":"Kerala",         "tip":"Bake on half shell with gruyère for oysters Rockefeller."},
    {"id":68, "name":"Clams (Teisidi/Mussels Mix)",  "cat":6, "price":349,  "orig":None, "rating":4.4, "rev":620,  "bs":False, "tr":False, "sea":True,  "unit":"per 500g", "origin":"Goa",            "tip":"Steam with white wine, garlic, and parsley. Serve immediately."},
    {"id":69, "name":"Green Mussels (Whole)",        "cat":6, "price":399,  "orig":449,  "rating":4.5, "rev":740,  "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"Mumbai",         "tip":"Make moules marinière with cream, wine and shallots."},
    {"id":70, "name":"Scallops (Shell On)",          "cat":6, "price":1199, "orig":1399, "rating":4.9, "rev":1560, "bs":True,  "tr":True,  "sea":True,  "unit":"per 6 pcs","origin":"Japan",           "tip":"Sear in butter 90 sec per side. Don't move them!"},
    {"id":71, "name":"Bay Scallop Meat",             "cat":6, "price":899,  "orig":None, "rating":4.6, "rev":780,  "bs":False, "tr":True,  "sea":False, "unit":"per 250g", "origin":"New Zealand",    "tip":"Toss into pasta or risotto in the last 3 minutes of cooking."},
    {"id":72, "name":"Cockles (Kube/Tisre)",         "cat":6, "price":249,  "orig":None, "rating":4.2, "rev":410,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Ratnagiri",      "tip":"Goan clam masala is legendary. Add coconut and chillies."},
    {"id":73, "name":"Abalone (Farmed)",             "cat":6, "price":1999, "orig":None, "rating":4.8, "rev":420,  "bs":False, "tr":True,  "sea":True,  "unit":"per 2 pcs","origin":"South Africa",    "tip":"Pound thin and pan-fry in butter for 30 seconds per side."},
    {"id":74, "name":"Sea Urchin (Uni)",             "cat":6, "price":1499, "orig":None, "rating":4.7, "rev":340,  "bs":False, "tr":True,  "sea":True,  "unit":"per 80g",  "origin":"Japan",          "tip":"Eat fresh on sushi rice. Add butter to pasta for a luxury dish."},
    {"id":75, "name":"Whelk (Sea Snails)",           "cat":6, "price":449,  "orig":None, "rating":4.1, "rev":210,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Kerala",         "tip":"Boil in spiced water and serve with a spicy dip."},

    # ── SMOKED (cat 7) ───────────────────────────────────────────────────────
    {"id":76, "name":"Smoked Salmon (Sliced)",       "cat":7, "price":999,  "orig":1199, "rating":4.8, "rev":1420, "bs":True,  "tr":True,  "sea":False, "unit":"per 200g", "origin":"Scotland",       "tip":"Serve on blinis with crème fraîche and capers for a party starter."},
    {"id":77, "name":"Smoked Mackerel Fillet",       "cat":7, "price":449,  "orig":None, "rating":4.5, "rev":680,  "bs":False, "tr":True,  "sea":False, "unit":"per 200g", "origin":"Norway",         "tip":"Flake into salads or spread on toast with cream cheese."},
    {"id":78, "name":"Smoked Hilsa",                 "cat":7, "price":1299, "orig":None, "rating":4.7, "rev":960,  "bs":True,  "tr":True,  "sea":False, "unit":"per 250g", "origin":"Bengal",         "tip":"Eat with steamed rice. An absolute Bengali delicacy."},
    {"id":79, "name":"Smoked Tuna Chunks",           "cat":7, "price":699,  "orig":799,  "rating":4.4, "rev":540,  "bs":False, "tr":False, "sea":False, "unit":"per 250g", "origin":"Indian Ocean",   "tip":"Perfect in salads, sandwiches, or pasta salads."},
    {"id":80, "name":"Smoked Prawns",                "cat":7, "price":849,  "orig":None, "rating":4.6, "rev":620,  "bs":False, "tr":True,  "sea":True,  "unit":"per 200g", "origin":"Kerala",         "tip":"Use as a protein-rich topping on pizza or avocado toast."},
    {"id":81, "name":"Smoked Oysters (Canned)",      "cat":7, "price":399,  "orig":None, "rating":4.3, "rev":480,  "bs":False, "tr":False, "sea":False, "unit":"per 85g",  "origin":"South Korea",    "tip":"A must-have pantry item for quick snacking on crackers."},
    {"id":82, "name":"Smoked Eel Fillet",            "cat":7, "price":899,  "orig":None, "rating":4.5, "rev":310,  "bs":False, "tr":True,  "sea":False, "unit":"per 200g", "origin":"Netherlands",    "tip":"Traditionally served with horseradish sauce on pumpernickel."},
    {"id":83, "name":"Smoked Kingfish Fillet",       "cat":7, "price":749,  "orig":None, "rating":4.6, "rev":580,  "bs":True,  "tr":True,  "sea":False, "unit":"per 250g", "origin":"Goa",            "tip":"Flake into a smoky fish curry or eat with bread and chutney."},

    # ── FROZEN (cat 8) ───────────────────────────────────────────────────────
    {"id":84, "name":"Frozen Fish Fingers",          "cat":8, "price":299,  "orig":None, "rating":4.3, "rev":1100, "bs":True,  "tr":False, "sea":False, "unit":"per 400g", "origin":"Processed",      "tip":"Bake at 220°C for 18 minutes or air-fry for 10 min."},
    {"id":85, "name":"Frozen Prawn Tempura",         "cat":8, "price":499,  "orig":599,  "rating":4.5, "rev":870,  "bs":True,  "tr":True,  "sea":False, "unit":"per 300g", "origin":"Thailand",       "tip":"Deep-fry straight from frozen for 3–4 minutes."},
    {"id":86, "name":"Frozen Lobster Bisque",        "cat":8, "price":749,  "orig":None, "rating":4.6, "rev":560,  "bs":False, "tr":True,  "sea":False, "unit":"per 500ml","origin":"France",          "tip":"Thaw overnight and reheat slowly. Add a swirl of cream."},
    {"id":87, "name":"Frozen Mixed Seafood Bag",     "cat":8, "price":599,  "orig":699,  "rating":4.4, "rev":1340, "bs":True,  "tr":False, "sea":False, "unit":"per 500g", "origin":"Mixed",          "tip":"Cook from frozen in a skillet with olive oil and garlic."},
    {"id":88, "name":"Frozen Salmon Portions",       "cat":8, "price":849,  "orig":None, "rating":4.6, "rev":780,  "bs":True,  "tr":True,  "sea":False, "unit":"per 4 pcs","origin":"Chile",           "tip":"Bake from frozen at 220°C for 22 minutes with lemon slices."},
    {"id":89, "name":"Frozen Crab Sticks",           "cat":8, "price":199,  "orig":None, "rating":4.0, "rev":640,  "bs":False, "tr":False, "sea":False, "unit":"per 200g", "origin":"Japan",          "tip":"Add to sushi rolls, salads, or eat straight from the pack."},
    {"id":90, "name":"Frozen Scallops",              "cat":8, "price":1099, "orig":1299, "rating":4.6, "rev":480,  "bs":False, "tr":True,  "sea":False, "unit":"per 300g", "origin":"New Zealand",    "tip":"Thaw overnight. Pat completely dry before searing for best crust."},
    {"id":91, "name":"Frozen Whole Pomfret",         "cat":8, "price":399,  "orig":None, "rating":4.4, "rev":560,  "bs":False, "tr":False, "sea":False, "unit":"per 500g", "origin":"Arabian Sea",    "tip":"Thaw, marinate in spices, and fry. As good as fresh!"},
    {"id":92, "name":"Frozen Squid Rings Battered",  "cat":8, "price":349,  "orig":399,  "rating":4.3, "rev":920,  "bs":True,  "tr":False, "sea":False, "unit":"per 400g", "origin":"Processed",      "tip":"Air-fry for the crispiest calamari without deep frying."},

    # ── READY-TO-COOK (cat 9) ────────────────────────────────────────────────
    {"id":93,  "name":"Prawn Moilee Kit",             "cat":9, "price":649,  "orig":None, "rating":4.7, "rev":980,  "bs":True,  "tr":True,  "sea":False, "unit":"per kit",  "origin":"Kerala",         "tip":"All spices and coconut milk included. Ready in 20 minutes."},
    {"id":94,  "name":"Fish Tikka Marinated",         "cat":9, "price":599,  "orig":699,  "rating":4.6, "rev":870,  "bs":True,  "tr":True,  "sea":False, "unit":"per 500g", "origin":"North India",    "tip":"Skewer and grill, or place in air-fryer for 12 min."},
    {"id":95,  "name":"Crab Xacuti Paste + Crab Kit", "cat":9, "price":849,  "orig":None, "rating":4.7, "rev":660,  "bs":False, "tr":True,  "sea":False, "unit":"per kit",  "origin":"Goa",            "tip":"Authentic Goan paste. Cook in 15 minutes. Restaurant-level taste."},
    {"id":96,  "name":"Lobster Thermidor Kit",        "cat":9, "price":1499, "orig":1799, "rating":4.8, "rev":540,  "bs":False, "tr":True,  "sea":True,  "unit":"per kit",  "origin":"France",         "tip":"Luxury made easy — everything you need for a stunning meal."},
    {"id":97,  "name":"Chilli Garlic Prawn Stir-Fry Kit","cat":9,"price":549,"orig":None,"rating":4.5,"rev":820,  "bs":True,  "tr":False, "sea":False, "unit":"per kit",  "origin":"Thailand",       "tip":"Ready in under 10 minutes. Add noodles or rice to complete."},
    {"id":98,  "name":"Malabar Fish Curry Kit",       "cat":9, "price":499,  "orig":None, "rating":4.6, "rev":960,  "bs":True,  "tr":True,  "sea":False, "unit":"per kit",  "origin":"Kerala",         "tip":"Pre-measured coconut milk and spices. Cook in 25 minutes."},
    {"id":99,  "name":"Thai Green Curry Seafood Kit", "cat":9, "price":699,  "orig":799,  "rating":4.6, "rev":730,  "bs":False, "tr":True,  "sea":True,  "unit":"per kit",  "origin":"Thailand",       "tip":"Includes green curry paste, coconut milk, and kaffir lime leaves."},
    {"id":100, "name":"Prawn Biryani Spice Kit",      "cat":9, "price":399,  "orig":None, "rating":4.5, "rev":1140, "bs":True,  "tr":False, "sea":False, "unit":"per kit",  "origin":"Hyderabad",      "tip":"Saffron, biryani masala, and fried onions all included."},
]


def run_seed():
    db = SessionLocal()
    try:
        # Upsert categories
        for c in CATEGORIES:
            existing = db.query(Category).filter(Category.id == c["id"]).first()
            if not existing:
                db.add(Category(
                    id=c["id"],
                    name=c["name"],
                    emoji=c["emoji"],
                    image_url=c["image_url"],
                ))
        db.commit()

        # Upsert products
        for p in PRODUCTS:
            existing = db.query(Product).filter(Product.id == p["id"]).first()
            if existing:
                continue
            db.add(Product(
                id=p["id"],
                name=p["name"],
                description=f"{p['name']} — Premium quality, freshly sourced from {p.get('origin', 'coastal waters')}. "
                            f"Hand-picked for the best flavour and texture.",
                price=p["price"],
                original_price=p.get("orig"),
                image_url=img(f"prod_{p['id']}"),
                category_id=p["cat"],
                rating=p["rating"],
                review_count=p["rev"],
                is_best_seller=p["bs"],
                is_top_rated=p["tr"],
                is_seasonal=p["sea"],
                in_stock=True,
                stock_quantity=100,
                unit=p.get("unit", "per kg"),
                origin=p.get("origin"),
                cooking_tip=p.get("tip"),
                tags=[
                    "seafood",
                    "fresh",
                    "delivery",
                    "oceanfresh",
                ] + ([p.get("origin", "").lower()] if p.get("origin") else []),
            ))
        db.commit()
        print(f"✅ Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")
    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
