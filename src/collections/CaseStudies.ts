const CaseStudies = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'date', 'published'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return {
        published: {
          equals: true,
        },
      };
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'challenge',
      type: 'richText',
      required: true,
      editor: 'lexical',
      admin: {
        description: 'The challenge or problem the client faced',
      },
    },
    {
      name: 'solution',
      type: 'richText',
      required: true,
      editor: 'lexical',
      admin: {
        description: 'How we solved it',
      },
    },
    {
      name: 'results',
      type: 'richText',
      required: true,
      editor: 'lexical',
      admin: {
        description: 'The outcomes and impact',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: 'lexical',
      admin: {
        description: 'Additional case study details',
      },
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'tech',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};

export default CaseStudies;
