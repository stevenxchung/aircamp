import { prisma } from "../src/server/db";

// Note: users must be created first (e.g., through AirCamp) to use process.env.USER_ID
const main = async () => {
  const mockUsers = [
    {
      airCampUserId: process.env.USER_ID,
      username: "DeepLearner",
      firstName: "Steven",
      lastName: "C",
      avatar: "https://avatars.githubusercontent.com/u/25748068?v=4",
    },
  ];

  const mockCampgrounds = [
    {
      airCampUserId: process.env.USER_ID,
      name: "Cloud's Rest",
      price: "666",
      summary:
        "Mountain camp in Yosemite National Park east northeast of Yosemite Village, California. Although there are many peaks in the park having far greater elevation, Clouds Rest's proximity to the valley gives it a very high degree of visual prominence.",
      description:
        "The summit can be reached by a 7.2-mile (11.6 km) trail hike from Tioga Pass Road or a 13-mile (21 km) trail hike from Happy Isles by way of Little Yosemite Valley. There are also several technical routes available. Clouds Rest is an arête; a thin, almost knife-like, ridge of rock formed when glaciers eroded away solid rock to form Tenaya Canyon and Little Yosemite Valley. The northwest face, mostly solid granite, rises 5,000 feet (1,520 m) above Tenaya Creek.",
      location: "Yosemite, California",
      lat: 37.7677,
      lng: -119.4894,
    },
    {
      airCampUserId: process.env.USER_ID,
      name: "Yellow Mountain",
      price: "777",
      summary:
        "Campsite near the mountain range in southern Anhui province in eastern China. Vegetation on the range is thickest below 1,100 meters (3,600 ft), with trees growing up to the treeline at 1,800 meters (5,900 ft).",
      description:
        "The area is well known for its scenery, sunsets, peculiarly-shaped granite peaks, Huangshan pine trees, hot springs, winter snow and views of the clouds from above. Huangshan is a frequent subject of traditional Chinese paintings and literature, as well as modern photography. It is a UNESCO World Heritage Site and one of China's major tourist destinations.",
      location: "Huangshan City, Anhui",
      lat: 29.7152,
      lng: 118.3387,
    },
    {
      airCampUserId: process.env.USER_ID,
      name: "Shangri-La",
      price: "888",
      summary:
        "Mountain camp in mystical, harmonious valley, gently guided from a lamasery, enclosed in the western end of the Kunlun Mountains. Shangri-La has become synonymous with any earthly paradise, particularly a mythical Himalayan utopia - an enduringly happy land, isolated from the world. In the novel, the people who live in Shangri-La are almost immortal, living hundreds of years beyond the normal lifespan and only very slowly aging in appearance.",
      description:
        "The highest mountain of the Kunlun Mountains is the Kunlun Goddess Peak (7,167 m) in the Keriya area of the western Kunlun Mountains. Some authorities claim that the Kunlun extends further northwest-wards as far as Kongur Tagh (7,649 m) and the famous Muztagh Ata (7,546 m). But these mountains are physically much more closely linked to the Pamir group (ancient Mount Imeon). The Arka Tagh (Arch Mountain) is in the center of the Kunlun Mountains; its highest points are Ulugh Muztagh (6,973 m) and Bukadaban Feng (6,860 m). In the eastern Kunlun Mountains the highest peaks are Yuzhu Peak (6,224 m) and Amne Machin [also Dradullungshong] (6,282 m); the latter is the major eastern peak of the Kunlun Mountains and is thus considered as the eastern edge of the Kunlun Mountains.",
      location: "Yunnan, China",
      lat: 27.8425,
      lng: 99.7432,
    },
    {
      airCampUserId: process.env.USER_ID,
      name: "Nusa Penida",
      price: "999",
      summary:
        "Beach camp on an island located near the southeastern Indonesian island of Bali and a district of Klungkung Regency that includes the neighboring small island of Nusa Lembongan and twelve even smaller islands. The Badung Strait separates the island and Bali.",
      description:
        "The interior of Nusa Penida is hilly with a maximum altitude of 524 metres. It is drier than the nearby island of Bali. It is one of the major tourist attractions among the three Nusa islands. There are thirteen small islands nearby - Nusa Lembongan, Nusa Ceningan and eleven even smaller - which are included within the district (Kecamatan).",
      location: "Bali, Indonesia",
      lat: -8.7278,
      lng: 115.5444,
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
