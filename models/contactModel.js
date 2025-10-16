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
 *         id:
 *           type: integer
 *           description: Contact ID
 *         name:
 *           type: string
 *           description: Contact name
 *         email:
 *           type: string
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         userId:
 *           type: integer
 *           description: User ID who owns the contact
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *         phone: '+1-202-555-0152'
 *         userId: 1
 */

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
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      updateDate: true,
    },
  },
  relations: {},
});
