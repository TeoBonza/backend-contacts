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
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
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
      type: 'objectId',
      objectId: true,
      generated: true,
    },
    username: {
      type: 'string',
      nullable: false,
    },
    email: {
      type: 'string',
      unique: true,
      nullable: false,
    },
    password: {
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
