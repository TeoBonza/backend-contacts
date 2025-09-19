const { EntitySchema } = require('typeorm');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Contact name
 *         email:
 *           type: string
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         phone: '+1-202-555-0152'
 */

module.exports = new EntitySchema({
  name: 'Contact',
  tableName: 'contacts',
  columns: {
    _id: {
      primary: true,
      type: 'objectId',
      objectId: true,
      generated: true,
    },
    user_id: {
      type: 'objectId',
      nullable: false,
    },
    name: {
      type: 'string',
      nullable: false,
    },
    email: {
      type: 'string',
      nullable: false,
    },
    phone: {
      type: 'string',
      nullable: false,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {},
});
