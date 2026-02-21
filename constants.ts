import { Product, Order, Booking, Customer } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Lagos Luxe Braids',
    price_ngn: 30000,
    price_pln: 150,
    category: 'Braids',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxLopvBFmETH856TW30BDxpecyL6_sZaeKvpH2GxBmkTY2oTSyNHUucax8HGkPCj0REQQpxxdZ4b9ND_gs5DLhFW-06AoiNZP-Lrn-OIzr56Bjt4Rs5muHqJZgAsJGGtyr5jR-R-1ltHboK4Ql0JvMycaymrcz2uQSxnyaYHXurRJkcRQmTD6_GOXHZ0FS5KqWYHXPYM5Ph84I5ZTelnb68TrbsKE4xtfimJyDOe_1St8pNyGOVkiXs1uWcrgCO2C3OPG3a837aU0',
    isNew: true,
    status: 'In Stock',
    sku: 'AFG-001'
  },
  {
    id: '2',
    name: 'Royal Silk Press Wig',
    price_ngn: 45000,
    price_pln: 450,
    category: 'Wigs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9zjAfZ6YAdk6TPZZWmN0gBAA5pslbFRKOTav3YDgH4yL4tczhHGvMolQv18WgdZBeXnefw1d_nzPc39PkIxF9CbkcKw1F4wtD9nO-VnTaV7hPrf-ie13GGAWCMSj02lA1-UbOpGu6wMtJSnq66to_hlMOSvQAPgHKsiv6rReprNb11As6cRfBaFYikSHu7gBpeW71jrhM2Etfk_8FBrzk-CVqqBGk3TEmyMNKb7KlGpc-7e3lS0Ua91PL3vkXlj0IQU9q8M6jM8U',
    isSale: true,
    status: 'In Stock',
    sku: 'AFG-002'
  },
  {
    id: '3',
    name: 'Afro Kinky Bulk',
    price_ngn: 24000,
    price_pln: 120,
    category: 'Extensions',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4-Ka1CaN6dTQ_5D6lHuhKitg6kYeF6tBR-i9HA9uaHK4Ev11vl-vugFlWPpHycahTCccaZ9HhvBLv90tnLwIKQqEYLhWGQ-3SEJ7h93cgD-6Eb99ReYq6ZrPLfGJVbGL7Sg7_3rqfgig0s3ykbhCUnmpKJA-EV8sF2vRchHWdPJvookPH4eDmZWRGNI0Hld4bgb-BEZJrjUWf6wTTiAki1N9TjvnNveHwAd1cKbwkdrnfiY4oH-njPRwoibpRx-kB3eLWGBOp_SA',
    status: 'In Stock',
    sku: 'AFG-003'
  },
  {
    id: '4',
    name: 'Velvet Sleek Ponytail',
    price_ngn: 19000,
    price_pln: 95,
    category: 'Ponytails',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXLPuP6XNchu5wjkpYpzHo8RJUQyE9YY41xDuFQgf8biE4nD2H-dlHgoWtnvrqN_vRcsydwRR6OEK77RFIk_vHyPTPgcpvi1Q8xGnY5aGAk2CfAkL6OIquoMZD4aK9EwghQCvTNmzlVSLMp67XzxPWk55t6JHDuOqmdlnHXeQCx2QRpgyvUgcT9aQX1zH3_TKO8Bk8SZVmnfPRClKmkVtk7DPrUnlemSVQNlDUubxZf65HuX1wYfzPqzQQ2mcTCZhrBMcryZaIBHQ',
    isNew: true,
    status: 'In Stock',
    sku: 'AFG-004'
  }
];

export const RECENT_ORDERS: Order[] = [
  {
    id: '#ORD-7829',
    customer: {
      name: 'Nneka O.',
      email: 'nneka@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf75k6hthRo6dQ7AkxPoeysj7vBcrna0t1SN66FM13jiJCAAD8PFZ9Cw17GS3AMpT1ouT_UeMCRZZ5VJtI4O3Q1ss05r2TCDJFho8_YlazYl4HtY3iN7opmFgKseyH7KoM8Pe2IlpgTbByv45zhPwd8e-2rUAIqfB3D4zSbvVk_JHfBY2zV154pGp24IAp-ITYfdBU1RYsZb-B_STxkpexD89jQFz24Ia9GN9Ib_JyVfX525UnJgc8rThPYGbcFpvrd0iCVG11sBw'
    },
    items: 'Lipstick, Serum...',
    date: 'Oct 24, 2023',
    market: 'Poland',
    total_pln: 124.00,
    total_ngn: 24800,
    status: 'Confirmed'
  },
  {
    id: '#ORD-7830',
    customer: {
      name: 'Anya W.',
      email: 'anya.w@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2c2JT0KGceV8hQyhSo0MkS6eF4fRFILKDbeQUv3EVzMNMGhn0uj9wT8JmDk-EZz-HoiJ9YqLEIxEZ7sJ475vhIpQ23Asalqzh1pliNDrHivVwy8M0vMnkpxhA4So0bkanuFqqbEyyQF_uTQjn-KQMQy-zlUAv5V00olIPElpbl2xKPsD75ZCIp3zf_Dsjgey44SZ6Tk4MZQOOzHg20743GvRgVBBu16vmpbM1FbnHdwLegKKndf5E4mSMXArEOclwu2B9oXUh_O0'
    },
    items: 'Foundation (1)',
    date: 'Oct 24, 2023',
    market: 'Nigeria',
    total_pln: 225,
    total_ngn: 45000,
    status: 'In Transit'
  }
];

export const BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customerName: 'Chiamaka B.',
    service: 'Bridal Makeup',
    stylist: 'Amara O.',
    date: 'Nov 12, 2024',
    time: '10:00 AM',
    status: 'Confirmed',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2c2JT0KGceV8hQyhSo0MkS6eF4fRFILKDbeQUv3EVzMNMGhn0uj9wT8JmDk-EZz-HoiJ9YqLEIxEZ7sJ475vhIpQ23Asalqzh1pliNDrHivVwy8M0vMnkpxhA4So0bkanuFqqbEyyQF_uTQjn-KQMQy-zlUAv5V00olIPElpbl2xKPsD75ZCIp3zf_Dsjgey44SZ6Tk4MZQOOzHg20743GvRgVBBu16vmpbM1FbnHdwLegKKndf5E4mSMXArEOclwu2B9oXUh_O0'
  },
  {
    id: 'BK-002',
    customerName: 'Kasia Nowak',
    service: 'Silk Press',
    stylist: 'Sarah J.',
    date: 'Nov 12, 2024',
    time: '02:00 PM',
    status: 'Pending',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf75k6hthRo6dQ7AkxPoeysj7vBcrna0t1SN66FM13jiJCAAD8PFZ9Cw17GS3AMpT1ouT_UeMCRZZ5VJtI4O3Q1ss05r2TCDJFho8_YlazYl4HtY3iN7opmFgKseyH7KoM8Pe2IlpgTbByv45zhPwd8e-2rUAIqfB3D4zSbvVk_JHfBY2zV154pGp24IAp-ITYfdBU1RYsZb-B_STxkpexD89jQFz24Ia9GN9Ib_JyVfX525UnJgc8rThPYGbcFpvrd0iCVG11sBw'
  }
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Nneka O.',
    email: 'nneka@example.com',
    totalOrders: 12,
    totalSpent_pln: 2400,
    lastActive: '2 hours ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf75k6hthRo6dQ7AkxPoeysj7vBcrna0t1SN66FM13jiJCAAD8PFZ9Cw17GS3AMpT1ouT_UeMCRZZ5VJtI4O3Q1ss05r2TCDJFho8_YlazYl4HtY3iN7opmFgKseyH7KoM8Pe2IlpgTbByv45zhPwd8e-2rUAIqfB3D4zSbvVk_JHfBY2zV154pGp24IAp-ITYfdBU1RYsZb-B_STxkpexD89jQFz24Ia9GN9Ib_JyVfX525UnJgc8rThPYGbcFpvrd0iCVG11sBw'
  },
  {
    id: 'CUS-002',
    name: 'Anya W.',
    email: 'anya.w@example.com',
    totalOrders: 5,
    totalSpent_pln: 850,
    lastActive: '1 day ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2c2JT0KGceV8hQyhSo0MkS6eF4fRFILKDbeQUv3EVzMNMGhn0uj9wT8JmDk-EZz-HoiJ9YqLEIxEZ7sJ475vhIpQ23Asalqzh1pliNDrHivVwy8M0vMnkpxhA4So0bkanuFqqbEyyQF_uTQjn-KQMQy-zlUAv5V00olIPElpbl2xKPsD75ZCIp3zf_Dsjgey44SZ6Tk4MZQOOzHg20743GvRgVBBu16vmpbM1FbnHdwLegKKndf5E4mSMXArEOclwu2B9oXUh_O0'
  }
];
