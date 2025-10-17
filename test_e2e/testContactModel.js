const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Contact',
  tableName: 'contacts',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true,
      generationStrategy: 'increment',
    },
    userId: {
      type: 'integer',
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    createdAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      createDate: true,
    },
    updatedAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      updateDate: true,
    },
  },
  relations: {},
});