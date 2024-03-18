import { prisma } from "../src/server/db";

// Note: users must be created first (e.g., through AirCamp) to use process.env.USER_ID
const main = async () => {
  const mockUsers = [
    {
      airCampUserId: process.env.USER_ID ?? "001",
      username: "DeepLearner",
      firstName: "Steven",
      lastName: "C",
      avatar: "https://avatars.githubusercontent.com/u/25748068?v=4",
    },
  ];

  const mockCampgrounds = [
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Mountain camp in Yosemite National Park east northeast of Yosemite Village, California. Although there are many peaks in the park having far greater elevation, Clouds Rest's proximity to the valley gives it a very high degree of visual prominence.",
      description:
        "The summit can be reached by a 7.2-mile (11.6 km) trail hike from Tioga Pass Road or a 13-mile (21 km) trail hike from Happy Isles by way of Little Yosemite Valley. There are also several technical routes available. Clouds Rest is an arête; a thin, almost knife-like, ridge of rock formed when glaciers eroded away solid rock to form Tenaya Canyon and Little Yosemite Valley. The northwest face, mostly solid granite, rises 5,000 feet (1,520 m) above Tenaya Creek.",
      name: "Cloud's Rest",
      price: "666",
      location: "Yosemite, California",
      lat: 37.7677,
      lng: -119.4894,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Campsite near the mountain range in southern Anhui province in eastern China. Vegetation on the range is thickest below 1,100 meters (3,600 ft), with trees growing up to the treeline at 1,800 meters (5,900 ft).",
      description:
        "The area is well known for its scenery, sunsets, peculiarly-shaped granite peaks, Huangshan pine trees, hot springs, winter snow and views of the clouds from above. Huangshan is a frequent subject of traditional Chinese paintings and literature, as well as modern photography. It is a UNESCO World Heritage Site and one of China's major tourist destinations.",
      name: "Yellow Mountain",
      price: "777",
      location: "Huangshan City, Anhui",
      lat: 29.7152,
      lng: 118.3387,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Mountain camp in mystical, harmonious valley, gently guided from a lamasery, enclosed in the western end of the Kunlun Mountains. Shangri-La has become synonymous with any earthly paradise, particularly a mythical Himalayan utopia - an enduringly happy land, isolated from the world. In the novel, the people who live in Shangri-La are almost immortal, living hundreds of years beyond the normal lifespan and only very slowly aging in appearance.",
      description:
        "The highest mountain of the Kunlun Mountains is the Kunlun Goddess Peak (7,167 m) in the Keriya area of the western Kunlun Mountains. Some authorities claim that the Kunlun extends further northwest-wards as far as Kongur Tagh (7,649 m) and the famous Muztagh Ata (7,546 m). But these mountains are physically much more closely linked to the Pamir group (ancient Mount Imeon). The Arka Tagh (Arch Mountain) is in the center of the Kunlun Mountains; its highest points are Ulugh Muztagh (6,973 m) and Bukadaban Feng (6,860 m). In the eastern Kunlun Mountains the highest peaks are Yuzhu Peak (6,224 m) and Amne Machin [also Dradullungshong] (6,282 m); the latter is the major eastern peak of the Kunlun Mountains and is thus considered as the eastern edge of the Kunlun Mountains.",
      name: "Shangri-La",
      price: "888",
      location: "Yunnan, China",
      lat: 27.8425,
      lng: 99.7432,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Beach camp on an island located near the southeastern Indonesian island of Bali and a district of Klungkung Regency that includes the neighboring small island of Nusa Lembongan and twelve even smaller islands. The Badung Strait separates the island and Bali.",
      description:
        "The interior of Nusa Penida is hilly with a maximum altitude of 524 metres. It is drier than the nearby island of Bali. It is one of the major tourist attractions among the three Nusa islands. There are thirteen small islands nearby - Nusa Lembongan, Nusa Ceningan and eleven even smaller - which are included within the district (Kecamatan).",
      name: "Nusa Penida",
      price: "999",
      location: "Bali, Indonesia",
      lat: -8.7278,
      lng: 115.5444,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Komodo island, part of the Lesser Sunda chain of Indonesian islands, is the rugged habitat of the 3m-long Komodo dragon monitor lizard.",
      description:
        "Komodo National Park covers the entire region and is home to more than 4,000 dragons, and is made up of rusty-red volcanic hills, savannah and forests. Its surrounding waters of seagrass beds, mangrove shrublands and coral reefs are famous for diving.",
      imageSource:
        "https://images.unsplash.com/photo-1571880826835-7ab2b833ad07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Komodo Island",
      price: "555",
      location: "Komodo Island, Indonesia",
      lat: -8.5850461,
      lng: 119.4411476,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Vágaris one of the 18 islands in the archipelago of the Faroe Islands and the most westerly of the large islands.",
      description:
        "The Vágar island shape is very distinctive, since on maps it resembles a dog's head. The fjord Sørvágsfjørður is the mouth and the lake Fjallavatn is the eye. Vágar is the first port of call for most foreigners travelling to the Faroe Islands, as it is home to the islands’ only airport, Vágar Airport. An airfield was built there during World War II by the British, who occupied the Faroe Islands with the islanders' consent. After the war it lay unused for about 20 years, but was then put back into service and expanded/modernized as required. It handles about 290,000 passengers a year (2016). Such large numbers by Faroese standards put a considerable strain on transport facilities, with the result that a road tunnel (Vágatunnilin) measuring 5 km (3 mi) in length and running under the sea now connects Vágar with the two largest islands in the Faroes and thus the capital Tórshavn.",
      imageSource:
        "https://images.unsplash.com/photo-1539674301301-46518fda6008?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Vágar",
      price: "444",
      location: "Vágar, Faroe Islands",
      lat: 62.09820089999999,
      lng: -7.2145002,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        'Tuscany is a region in central Italy. Its capital, Florence, is home to some of the world’s most recognizable Renaissance art and architecture, including Michelangelo’s "David" statue, Botticelli’s works in the Uffizi Gallery and the Duomo basilica.',
      description:
        "Roughly triangular in shape, Tuscany borders the regions of Liguria to the northwest, Emilia-Romagna to the north, Marche and Umbria to the east, and Lazio to the south and southeast. The comune (municipality) of Badia Tedalda, in the Tuscan Province of Arezzo, has an exclave named Ca' Raffaello within Emilia-Romagna.",
      imageSource:
        "https://images.unsplash.com/photo-1624356417152-a1069f183130?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Toskāna",
      price: "333",
      location: "Toskāna, Italy",
      lat: 43.066667,
      lng: 11.2486208,
    },
    {
      airCampUserId: process.env.USER_ID ?? "001",
      summary:
        "Also known as the Dolomite Mountains, Dolomite Alps or Dolomitic Alps, are a mountain range in northeastern Italy. They form part of the Southern Limestone Alps and extend from the River Adige in the west to the Piave Valley (Pieve di Cadore) in the east.",
      description:
        "For millennia, hunters and gatherers had advanced into the highest rocky regions and had probably also climbed some peaks. There is evidence that the Jesuit priest Franz von Wulfen from Klagenfurt climbed the Lungkofel and the Dürrenstein in the 1790s. In 1857 Irishman John Ball was the first known person to climb Monte Pelmo. Paul Grohmann later climbed numerous peaks such as the Antelao, Marmolada, Tofana, Monte Cristallo and the Boè. Around 1860 the Agordin mountaineer Simone de Silvestro was the first person to stand on the Civetta. Michael Innerkofler was one of the climbers of the Tre Cime di Lavaredo. Later very important local mountaineers, known for many first ascents, were Angelo Dibona and Giovanni Piaz.",
      imageSource:
        "https://images.unsplash.com/photo-1696333489340-3cb72a2cd6f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Prato Piazza",
      price: "222",
      location: "Prato Piazza, BZ, Italia",
      lat: 46.64949379999999,
      lng: 12.1853094,
    },
  ];

  for (const user of mockUsers) {
    await prisma.airCampUser.upsert({
      where: { username: user.username },
      create: user,
      update: user,
    });
  }

  for (const campground of mockCampgrounds) {
    await prisma.airCampCampground.upsert({
      where: { name: campground.name },
      create: campground,
      update: campground,
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
