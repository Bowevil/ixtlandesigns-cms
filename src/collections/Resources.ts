const Resources = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'published'],
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
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: 'lexical',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Guide',
          value: 'guide',
        },
        {
          label: 'Article',
          value: 'article',
        },
        {
          label: 'Tutorial',
          value: 'tutorial',
        },
        {
          label: 'Tool',
          value: 'tool',
        },
      ],
      required: true,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
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

export default Resources;
