export default class MockData {
  static CATEGORY_1 = {
    id: 1,
    title: 'Pizza American Style Breakfast',
    image: {
      thumbnail:
        'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      banner:
        'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      original:
        'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'
    }
  }

  static CATEGORY_2 = {
    id: 2,
    title: 'Sushi',
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_960_720.jpg'
    }
  }
  static CATEGORY_3 = {
    id: 3,
    title: 'Salads',
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2017/08/05/12/32/flat-lay-2583212_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2017/08/05/12/32/flat-lay-2583212_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2017/08/05/12/32/flat-lay-2583212_960_720.jpg'
    }
  }
  static CATEGORY_4 = {
    id: 4,
    title: 'Sandwich',
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2017/08/06/20/36/green-2596087_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2017/08/06/20/36/green-2596087_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2017/08/06/20/36/green-2596087_960_720.jpg'
    }
  }
  static CATEGORY_5 = {
    id: 5,
    title: 'Ramen',
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2014/11/05/16/00/thai-food-518035_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2014/11/05/16/00/thai-food-518035_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2014/11/05/16/00/thai-food-518035_960_720.jpg'
    }
  }

  static CATEGORIES = [
    MockData.CATEGORY_1,
    MockData.CATEGORY_2,
    MockData.CATEGORY_3,
    MockData.CATEGORY_4,
    MockData.CATEGORY_5
  ]

  static VENUE_1 = {
    id: 1,
    title: 'Akaka Poke',
    total_ratings: '101',
    average_rating: '3.4',
    currency: 'eur',
    minimum_order_amount: 1000,
    delivery_fee: 250,
    categories: [{ id: 1, title: 'Poke' }],
    image: {
      thumbnail:
        'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      banner:
        'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      original:
        'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'
    },
    location: {
      id: 3,
      latitude: 53.333066,
      longitude: -6.242886,
      address_line_1: 'Baggot Street Upper',
      address_line_2: null,
      address_line_3: null,
      city: 'Dublin',
      country: 'Ireland',
      state: 'Dublin',
      postal_code: null,
      country_short: 'IE'
    },
    opening_hours: [
      {
        day: 'tuesday',
        opens_at: '17:00',
        closes_at: '19:00'
      },
      {
        day: 'wednesday',
        opens_at: '12:00',
        closes_at: '15:00'
      },
      {
        day: 'Thursday',
        opens_at: '12:00',
        closes_at: '15:00'
      }
    ]
  }

  static VENUE_2 = {
    id: 1,
    title: 'Meltdown',
    total_ratings: '50',
    average_rating: '4.5',
    delivery_fee: 400,
    categories: [{ id: 1, title: 'Sandwiches' }],
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2017/04/13/02/58/grilled-cheese-2226460_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2017/04/13/02/58/grilled-cheese-2226460_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2017/04/13/02/58/grilled-cheese-2226460_960_720.jpg'
    }
  }
  static VENUE_3 = {
    id: 1,
    title: 'Subway',
    total_ratings: '200',
    average_rating: '3.2',
    delivery_fee: 250,
    categories: [
      { id: 1, title: 'Sandwiches' },
      { id: 2, title: 'Desserts' },
      { id: 3, title: 'Cookies' },
      { id: 1, title: 'Sandwiches' },
      { id: 2, title: 'Desserts' },
      { id: 3, title: 'Cookies' },
      { id: 1, title: 'Sandwiches' },
      { id: 2, title: 'Desserts' },
      { id: 3, title: 'Cookies' },
      { id: 3, title: 'Cookies' },
      { id: 1, title: 'Sandwiches' },
      { id: 2, title: 'Desserts' },
      { id: 3, title: 'Cookies' },
      { id: 1, title: 'Sandwiches' },
      { id: 3, title: 'Cookies' },
      { id: 1, title: 'Sandwiches' },
      { id: 2, title: 'Desserts' },
      { id: 3, title: 'Cookies' },
      { id: 1, title: 'Sandwiches' },
      { id: 2, title: 'Desserts' },
      { id: 3, title: 'End' }
    ],
    image: {
      thumbnail:
        'https://images.pexels.com/photos/1603898/pexels-photo-1603898.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      banner:
        'https://images.pexels.com/photos/1603898/pexels-photo-1603898.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      original:
        'https://images.pexels.com/photos/1603898/pexels-photo-1603898.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'
    }
  }
  static VENUE_4 = {
    id: 1,
    title: 'Aoki Sushi',
    total_ratings: '69',
    average_rating: '4.0',
    delivery_fee: 250,
    categories: [{ id: 1, title: 'Japanese' }, { id: 2, title: 'Sushi' }],
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2017/02/22/23/21/asian-food-2090947_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2017/02/22/23/21/asian-food-2090947_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2017/02/22/23/21/asian-food-2090947_960_720.jpg'
    }
  }
  static VENUE_5 = {
    id: 1,
    title: 'Umi Falafel',
    total_ratings: '55',
    average_rating: '3.5',
    delivery_fee: 300,
    categories: [{ id: 1, title: 'Lebanese' }, { id: 2, title: 'Falafel' }],
    image: {
      thumbnail:
        'https://cdn.pixabay.com/photo/2016/09/06/14/24/hummus-1649231_960_720.jpg',
      banner:
        'https://cdn.pixabay.com/photo/2016/09/06/14/24/hummus-1649231_960_720.jpg',
      original:
        'https://cdn.pixabay.com/photo/2016/09/06/14/24/hummus-1649231_960_720.jpg'
    }
  }

  static TOP_VENUES = [
    MockData.VENUE_1,
    MockData.VENUE_2,
    MockData.VENUE_3,
    MockData.VENUE_4,
    MockData.VENUE_5
  ]

  static DIET_1 = {
    id: 1,
    title: 'Gluten Free',
    searchable: true
  }

  static LOCATION_1 = {
    id: 1,
    address_line_1: '32 Baggot Street',
    address_line_2: 'Line 2',
    address_line_3: 'Line 3',
    city: 'Dublin',
    state: 'Dublin',
    latitude: '53.333',
    longitude: '-6.243',
    country: 'Ireland',
    postal_code: 'D24 XD43',
    country_short: 'IE'
  }

  static LOCATIONS = [MockData.LOCATION_1]

  static CARD_DETAILS = {
    id: 1,
    customer_id: 1,
    last_four: '1987',
    expiry_month: '12',
    expiry_year: '24',
    name: 'Maverick Andaloc',
    brand: 'visa',
    is_default: false,
    stripe_card_id: '12345dfg'
  }

  static CARD_DETAILS_2 = {
    id: 2,
    customer_id: 1,
    last_four: '1234',
    expiry_month: '12',
    expiry_year: '24',
    name: 'Maverick Andy',
    brand: 'mastercard',
    is_default: true,
    stripe_card_id: '12345dfg'
  }

  static CARDS = [MockData.CARD_DETAILS, MockData.CARD_DETAILS_2]

  static ORDER_1 = {
    id: 1,
    customer_id: 1,
    venue: {
      id: 1,
      title: 'Boojum'
    },
    delivery: {
      location: 'Baggot Street'
    },
    created_at: '2019-09-10T15:26:33.670120Z',
    currency: 'eur',
    price: 1030
  }

  static GET_FILTERS = {
    order_options: [
      {
        title: 'Name',
        value: 'title'
      },
      {
        title: 'Top Rated',
        value: 'average_rating'
      }
    ],
    order_directions: ['asc', 'desc'],
    offers: [
      {
        title: 'All Offers',
        value: 'all_offers'
      },
      {
        title: 'Meal Deals',
        value: 'meal_deals'
      },
      {
        title: 'Special Offer',
        value: 'special_offer'
      }
    ],
    categories: [
      {
        id: 1,
        title: 'Thai',
        image: {
          thumbnail:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/thumbnail_image_10-09-2019_15:25:35.jpg',
          banner:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/banner_image_10-09-2019_15:25:35.jpg',
          original:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/original_image_10-09-2019_15:25:35.jpg'
        }
      },
      {
        id: 4,
        title: 'Turkish',
        image: {
          thumbnail:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/thumbnail_image_10-09-2019_15:25:35.jpg',
          banner:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/banner_image_10-09-2019_15:25:35.jpg',
          original:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/original_image_10-09-2019_15:25:35.jpg'
        }
      },
      {
        id: 2,
        title: 'American',
        image: {
          thumbnail:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/thumbnail_image_10-09-2019_15:25:35.jpg',
          banner:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/banner_image_10-09-2019_15:25:35.jpg',
          original:
            'https://d18vxhs8hxcskc.cloudfront.net/categories/original_image_10-09-2019_15:25:35.jpg'
        }
      }
    ],
    dietaries: [
      {
        id: 3,
        title: 'halal',
        searchable: true
      },
      {
        id: 1,
        title: 'vegan',
        searchable: true
      },
      {
        id: 2,
        title: 'gluten free',
        searchable: true
      }
    ]
  }

  static GET_MENU = {
    id: 1,
    venue: {
      title: 'Boojum',
      delivery_fee: 200,
      location: {
        id: 3,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: 'Baggot Street Upper',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: null,
        country_short: 'IE'
      }
    },
    items: [
      {
        id: 1,
        quantity: 1,
        menu_item: {
          title: 'Lunch for One Deal',
          price: 630
        },
        menu_item_options: [
          {
            id: 1,
            title: 'Meatball Marinara',
            quantity: 2
          },
          {
            id: 2,
            title: '9-Grain Honey Oat Bread',
            quantity: 2
          },
          {
            id: 3,
            title: 'Toasted',
            quantity: 0
          }
        ]
      }
    ]
  }

  static MENU = {
    id: 1,
    venue_id: 2,
    venue: {
      title: 'Subway',
      total_rating: 99,
      average_rating: 4.5,
      images: [
        {
          banner:
            'https://cdn.pixabay.com/photo/2015/08/16/12/03/sandwich-890823_960_720.jpg'
        },
        {
          banner:
            'https://cdn.pixabay.com/photo/2014/09/18/21/17/sandwich-451403_960_720.jpg'
        },
        {
          banner:
            'https://cdn.pixabay.com/photo/2016/03/05/20/02/appetizer-1238615_960_720.jpg'
        }
      ],
      opening_hours: [
        {
          day: 'tuesday',
          opens_at: '17:00',
          closes_at: '19:00'
        },
        {
          day: 'wednesday',
          opens_at: '12:00',
          closes_at: '15:00'
        },
        {
          day: 'Thursday',
          opens_at: '12:00',
          closes_at: '15:00'
        }
      ],
      location: {
        id: 1,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: '6 Baggot Street Upper',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: 'D04 XED3',
        country_short: 'IE'
      }
    },
    currency: 'eur',
    sections: [
      {
        title: 'Meal Deal',
        items: [
          {
            id: 1,
            title: 'Lunch for One Deal',
            description:
              'Short Description of what is in it to let people know',
            image:
              'https://cdn.pixabay.com/photo/2017/03/10/13/49/fast-food-2132863_960_720.jpg',
            price: 1030,
            reduced_price: 830,
            special_offer: true,
            option_groups: [
              {
                id: 201,
                title: 'Meat',
                options: [
                  { id: 1, title: 'Turkey & Ham', price: null, quantity: 0 },
                  {
                    id: 2,
                    title: 'Chicken Bacon Ranch Melt',
                    price: 100,
                    quantity: 0
                  },
                  {
                    id: 3,
                    title: 'Meatball Marinara',
                    price: null,
                    quantity: 0
                  }
                ],
                multi_select: true
              },
              {
                id: 205,
                title: 'Cheese',
                options: [
                  { id: 10, title: 'American Cheese', price: 100, quantity: 0 },
                  { id: 11, title: 'Cheddar Cheese', price: null, quantity: 0 },
                  {
                    id: 12,
                    title: 'Peppered Cheese',
                    price: null,
                    quantity: 0
                  },
                  { id: 15, title: 'Monterey Cheese', price: 100, quantity: 0 }
                ],
                multi_select: true
              },
              {
                id: 209,
                title: 'Bread',
                options: [
                  { id: 21, title: '9 Grain Oat', price: null, quantity: 0 },
                  { id: 22, title: 'Flat beard', price: null, quantity: 0 },
                  { id: 23, title: 'Italian Bread', price: null, quantity: 0 },
                  {
                    id: 44,
                    title: 'Italian Herb & Cheese',
                    price: null,
                    quantity: 0
                  },
                  { id: 165, title: 'Brown Bread', price: null, quantity: 0 }
                ],
                multi_select: false
              },
              {
                id: 210,
                title: 'Temperature',
                options: [
                  { id: 131, title: 'Toasted', price: null, quantity: 0 },
                  { id: 132, title: 'Not Toasted', price: null, quantity: 0 }
                ],
                multi_select: false
              }
            ]
          },
          {
            id: 2,
            title: 'BBQ Chicken',
            description:
              'Short Description of what is in it to let people know',
            image:
              'https://cdn.pixabay.com/photo/2018/10/22/12/30/teriyaki-chicken-3765240_960_720.jpg',
            price: '1030',
            reduced_price: '0',
            special_offer: false,
            option_groups: [
              {
                title: 'Meat',
                options: [
                  { id: 1, title: 'Turkey & Ham', price: null },
                  {
                    id: 2,
                    title: 'Chicken Bacon Ranch Melt',
                    price: 100
                  },
                  { id: 3, title: 'Meatball Marinara', price: null }
                ],
                multi_select: 'false'
              },
              {
                title: 'Cheese',
                options: [
                  { id: 1, title: 'American Cheese', price: 100 },
                  { id: 2, title: 'Cheddar Cheese', price: null },
                  { id: 3, title: 'Peppered Cheese', price: null },
                  { id: 4, title: 'Monterey Cheese', price: 100 }
                ],
                multi_select: 'true'
              },
              {
                title: 'Bread',
                options: [
                  { id: 1, title: '9 Grain Oat', price: null },
                  { id: 2, title: 'Flat beard', price: null },
                  { id: 3, title: 'Italian Bread', price: null },
                  {
                    id: 4,
                    title: 'Italian Herb & Cheese',
                    price: null
                  },
                  { id: 5, title: 'Brown Bread', price: null }
                ],
                multi_select: 'true'
              },
              {
                title: 'Temperature',
                options: [
                  { id: 1, title: 'Toasted', price: null },
                  { id: 2, title: 'Not Toasted', price: null }
                ],
                multi_select: 'true'
              }
            ]
          }
        ]
      },
      {
        title: 'Bundle',
        items: [
          {
            id: 1,
            title: 'Lunch for One Deal',
            description:
              'Short Description of what is in it to let people know',
            image:
              'https://cdn.pixabay.com/photo/2017/03/10/13/49/fast-food-2132863_960_720.jpg',
            price: '1030',
            reduced_price: '430',
            special_offer: true,
            option_groups: [
              {
                title: 'Meat',
                options: [
                  { id: 1, title: 'Turkey & Ham', price: null },
                  {
                    id: 2,
                    title: 'Chicken Bacon Ranch Melt',
                    price: 100
                  },
                  { id: 3, title: 'Meatball Marinara', price: null }
                ],
                multi_select: 'false'
              },
              {
                title: 'Cheese',
                options: [
                  { id: 1, title: 'American Cheese', price: 100 },
                  { id: 2, title: 'Cheddar Cheese', price: null },
                  { id: 3, title: 'Peppered Cheese', price: null },
                  { id: 4, title: 'Monterey Cheese', price: 100 }
                ],
                multi_select: 'true'
              },
              {
                title: 'Bread',
                options: [
                  { id: 1, title: '9 Grain Oat', price: null },
                  { id: 2, title: 'Flat beard', price: null },
                  { id: 3, title: 'Italian Bread', price: null },
                  {
                    id: 4,
                    title: 'Italian Herb & Cheese',
                    price: null
                  },
                  { id: 5, title: 'Brown Bread', price: null }
                ],
                multi_select: 'true'
              },
              {
                title: 'Temperature',
                options: [
                  { id: 1, title: 'Toasted', price: null },
                  { id: 2, title: 'Not Toasted', price: null }
                ],
                multi_select: 'true'
              }
            ]
          }
        ]
      },
      {
        title: 'Subs',
        items: [
          {
            id: 1,
            title: 'Lunch for One Deal',
            description:
              'Short Description of what is in it to let people know',
            image:
              'https://cdn.pixabay.com/photo/2017/03/10/13/49/fast-food-2132863_960_720.jpg',
            price: '1030',
            reduced_price: '830',
            special_offer: true,
            option_groups: [
              {
                title: 'Meat',
                options: [
                  { id: 1, title: 'Turkey & Ham', price: null },
                  {
                    id: 2,
                    title: 'Chicken Bacon Ranch Melt',
                    price: 100
                  },
                  { id: 3, title: 'Meatball Marinara', price: null }
                ],
                multi_select: 'false'
              },
              {
                title: 'Cheese',
                options: [
                  { id: 1, title: 'American Cheese', price: 100 },
                  { id: 2, title: 'Cheddar Cheese', price: null },
                  { id: 3, title: 'Peppered Cheese', price: null },
                  { id: 4, title: 'Monterey Cheese', price: 100 }
                ],
                multi_select: 'true'
              },
              {
                title: 'Bread',
                options: [
                  { id: 1, title: '9 Grain Oat', price: null },
                  { id: 2, title: 'Flat beard', price: null },
                  { id: 3, title: 'Italian Bread', price: null },
                  {
                    id: 4,
                    title: 'Italian Herb & Cheese',
                    price: null
                  },
                  { id: 5, title: 'Brown Bread', price: null }
                ],
                multi_select: 'true'
              },
              {
                title: 'Temperature',
                options: [
                  { id: 1, title: 'Toasted', price: null },
                  { id: 2, title: 'Not Toasted', price: null }
                ],
                multi_select: 'true'
              }
            ]
          }
        ]
      },
      {
        title: 'Salads',
        items: [
          {
            id: 1,
            title: 'Caesar Salad',
            description:
              'Short Description of what is in it to let people know',
            image:
              'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_960_720.jpg',
            price: '1030',
            reduced_price: '650',
            special_offer: true,
            option_groups: [
              {
                title: 'Dressing',
                options: [
                  {
                    id: 1,
                    title: 'Virgin Olive Oil',
                    price: null,
                    quantity: 1
                  },
                  {
                    id: 2,
                    title: 'Thousand Island dressing',
                    price: 100
                  },
                  { id: 3, title: 'Vingerette', price: null },
                  { id: 4, title: 'Caesar Dressing', price: null }
                ],
                multi_select: 'false'
              }
            ]
          }
        ]
      },
      {
        title: 'Deserts',
        items: [
          {
            id: 1,
            title: 'Cookies',
            description: 'Assortment of seasonal cookies',
            image:
              'https://cdn.pixabay.com/photo/2015/05/07/15/08/pastries-756601_960_720.jpg',
            price: '500',
            reduced_price: '250',
            special_offer: true,
            option_groups: []
          }
        ]
      }
    ]
  }

  static GET_ORDERS = [
    {
      id: 1,
      ready_at: '2019-09-24T16:40:00.670120Z',
      status: 'pending',
      food_status: 'pending',
      customer: {
        first_name: 'Alexander',
        last_name: 'Butler',
        phone_number: '857327698',
        country_code: '+353'
      },
      venue: {
        title: 'Boojum',
        delivery_fee: 200,
        location: {
          id: 3,
          latitude: 53.333066,
          longitude: -6.242886,
          address_line_1: 'Baggot Street Upper',
          address_line_2: null,
          address_line_3: null,
          city: 'Dublin',
          country: 'Ireland',
          state: 'Dublin',
          postal_code: null,
          country_short: 'IE'
        }
      },
      payment_type: 'card',
      total_price: 1030,
      currency: 'eur',
      card: {
        brand: 'visa',
        last_four: '8811'
      },
      created_at: '2019-09-25T16:40:00.670120Z',
      items: [
        {
          id: 1,
          quantity: 1,
          menu_item: {
            title: 'Lunch for One Deal',
            price: 630
          },
          menu_item_options: [
            {
              id: 1,
              title: 'Meatball Marinara',
              quantity: 2
            },
            {
              id: 2,
              title: '9-Grain Honey Oat Bread',
              quantity: 2
            },
            {
              id: 3,
              title: 'Toasted',
              quantity: 0
            }
          ]
        },
        {
          id: 2,
          quantity: 3,
          menu_item: {
            title: 'French Fries',
            price: 230
          },
          menu_item_options: []
        },
        {
          id: 3,
          quantity: 4,
          menu_item: {
            title: 'Cans of coke',
            price: 250
          },
          menu_item_options: []
        }
      ]
    },
    {
      id: 1,
      ready_at: '2019-09-25T15:30:00.670120Z',
      status: 'pending',
      food_status: 'pending',
      customer: {
        first_name: 'Alexander',
        last_name: 'Butler',
        phone_number: '857327698',
        country_code: '+353'
      },
      venue: {
        title: 'Boojum',
        delivery_fee: 200,
        location: {
          id: 3,
          latitude: 53.333066,
          longitude: -6.242886,
          address_line_1: 'Baggot Street Upper',
          address_line_2: null,
          address_line_3: null,
          city: 'Dublin',
          country: 'Ireland',
          state: 'Dublin',
          postal_code: null,
          country_short: 'IE'
        }
      },
      payment_type: 'card',
      total_price: 1030,
      currency: 'eur',
      card: {
        brand: 'visa',
        last_four: '8811'
      },
      created_at: '2019-09-10T15:26:33.670120Z',
      items: [
        {
          id: 1,
          quantity: 4,
          menu_item: {
            title: 'Double Bacon Cheeseburgers',
            price: 650
          },
          menu_item_options: []
        },
        {
          id: 2,
          quantity: 2,
          menu_item: {
            title: 'Oreo Shake',
            price: 450
          },
          menu_item_options: []
        }
      ]
    }
  ]

  static GET_ORDER = {
    id: 4,
    currency: 'eur',
    venue: {
      id: 1,
      title: 'Nutbutter',
      location: {
        id: 3,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: 'Baggot Street Upper',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: null,
        country_short: 'IE'
      },
      currency: 'eur',
      delivery_fee: '250'
    },
    total_price: 2775,
    ready_at: '2019-10-23T14:00:00Z',
    created_at: '2019-10-21T15:42:53.870654Z',
    accepted_at: null,
    rejected_at: null,
    cancelled_at: null,
    instructions: 'Sauce on the side.',
    cutlery: true,
    data: {
      items: [
        {
          id: 2,
          price: 1750,
          title: 'Squash, Cranberry & Almond & Cookies',
          quantity: 3,
          option_groups: [
            {
              id: 1,
              options: [
                {
                  id: 1,
                  price: 100,
                  title: 'Black Rice',
                  quantity: 1,
                  preparation_time: 0
                }
              ]
            }
          ],
          preparation_time: 30
        }
      ],
      location: {
        id: 3,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: 'Baggot Street Upper',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: null,
        country_short: 'IE'
      },
      card: {
        id: 2,
        name: null,
        brand: 'Visa',
        company: null,
        customer: 1,
        last_four: '4242',
        created_at: '2019-10-21T14:08:51.390609Z',
        is_default: true,
        updated_at: '2019-10-21T14:08:51.390567Z',
        expiry_year: 2020,
        expiry_month: 10
      },
      coupon: {
        id: 4,
        code: '50%OFF',
        type: 'percentage',
        limit: 100,
        title: '50 % off',
        value: 0.5,
        active: true,
        ends_at: '2019-11-20T00:00:00Z',
        starts_at: '2019-10-02T00:00:00Z',
        created_at: '2019-10-21T11:53:58.693216Z',
        updated_at: '2019-10-21T13:28:15.567950Z',
        description: 'some coupon description here',
        amount_remaining: 79
      },
      venue_location: {
        id: 1,
        city: 'Dublin',
        state: 'Dublin',
        country: 'Ireland',
        latitude: 53.2932326,
        longitude: -6.2506188,
        postal_code: null,
        country_short: 'IE',
        address_line_1: 'Rotunda',
        address_line_2: null,
        address_line_3: null
      }
    }
  }

  static COUPON = {
    id: 4,
    title: '50% off',
    code: '50OFF',
    description: 'Something for Admin',
    limit: 500,
    starts_at: '2019-09-1T09:00:00.670120Z',
    ends_at: '2019-10-31T15:30:00.670120Z',
    value: '0.5',
    type: 'percentage'
  }

  static GET_VENUES = [
    {
      id: 1,
      title: 'Boojum',
      location: {
        id: 3,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: 'Baggot Street Upper',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: null,
        country_short: 'IE'
      }
    },
    {
      id: 2,
      title: 'Subway',
      location: {
        id: 3,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: 'O Connell Street',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: null,
        country_short: 'IE'
      }
    },
    {
      id: 3,
      title: 'Bunsen Burger',
      location: {
        id: 3,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: 'Lower Dawson Street',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: null,
        country_short: 'IE'
      }
    }
  ]

  static STATS = [
    { id: 3, title: 'Income', value: 55000 },
    { id: 2, title: 'Transaction Fees', value: 5000 },
    { id: 1, title: 'Total Collected', value: 50000 }
  ]

  static REVIEW_ORDER = {
    card: 2,
    cutlery: false,
    delivery: true,
    total_price: 1280,
    items: [
      {
        id: 1,
        price: 1030,
        quantity: 1,
        title: 'Lunch for One Deal',
        option_groups: [
          {
            id: 201,
            title: 'Meat',
            options: [
              { id: 1, price: null, quantity: 1, title: 'Turkey & Ham' }
            ]
          },
          {
            id: 205,
            title: 'Cheese',
            options: [
              { id: 11, price: null, quantity: 1, title: 'Cheedar Cheese' }
            ]
          }
        ]
      }
    ],
    currency: 'eur',
    menu: 1,
    payment_type: 'card',
    ready_at: 'Tue Oct 22 2019 16:47:57 GMT+0100 (Irish Standard Time)',
    venue: {
      title: 'Subway',
      total_rating: 99,
      average_rating: 4.5,
      images: [
        {
          banner:
            'https://cdn.pixabay.com/photo/2015/08/16/12/03/sandwich-890823_960_720.jpg'
        },
        {
          banner:
            'https://cdn.pixabay.com/photo/2014/09/18/21/17/sandwich-451403_960_720.jpg'
        },
        {
          banner:
            'https://cdn.pixabay.com/photo/2016/03/05/20/02/appetizer-1238615_960_720.jpg'
        }
      ],
      location: {
        id: 1,
        latitude: 53.333066,
        longitude: -6.242886,
        address_line_1: '6 Baggot Street Upper',
        address_line_2: null,
        address_line_3: null,
        city: 'Dublin',
        country: 'Ireland',
        state: 'Dublin',
        postal_code: 'D04 XED3',
        country_short: 'IE'
      }
    }
  }

  static REVIEW_ORDERS = [MockData.REVIEW_ORDER]
}
