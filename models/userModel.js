const { EntitySchema } = require('typeorm');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         id: 1
 *         username: johndoe
 *         email: john@example.com
 *         password: secret123
 */

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true,
      generationStrategy: 'increment',
    },
    username: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
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
