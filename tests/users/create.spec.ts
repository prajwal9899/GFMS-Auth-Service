// import { DataSource } from 'typeorm';
// import { AppDataSource } from '../../src/config/data-source';
// import app from '../../src/app';
// import request from 'supertest';
// import createJWKSMock from 'mock-jwks';
// import { User } from '../../src/entity/User';
// import { Roles } from '../../src/constants';

// describe('POST /users', () => {
//   let connection: DataSource;
//   let jwks: ReturnType<typeof createJWKSMock>;
//   beforeAll(async () => {
//     jwks = createJWKSMock('http://localhost:5501');
//     connection = await AppDataSource.initialize();
//   });

//   beforeEach(async () => {
//     jwks.start();
//     await connection.dropDatabase();
//     await connection.synchronize();
//   });

//   afterEach(() => {
//     jwks.stop();
//   });

//   afterAll(async () => {
//     await connection.destroy();
//   });

//   describe('Given all fields', () => {
//     it('Should persist the user in the database', async () => {
//       const adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//         role: Roles.MANAGER,
//       };

//       const response = await request(app)
//         .post('/users')
//         .set('Cookie', [`accessToken=${adminToken}`])
//         .send(userData);

//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find();

//       //   expect(response.statusCode).toBe(401);
//       expect(users).toHaveLength(1);
//       expect(users[0].role).toBe(Roles.MANAGER);
//       expect(users[0].email).toBe(userData.email);
//     });

//     it('Should create a manager user in the database', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//         role: Roles.MANAGER,
//       };

//       const adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });

//       const response = await request(app)
//         .post('/users')
//         .set('Cookie', [`accessToken=${adminToken}`])
//         .send(userData);

//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find();

//       expect(users).toHaveLength(1);
//       expect(users[0].role).toBe(Roles.MANAGER);
//     });

//     it.todo('it should return 403 if non admin users try to create a user');
//   });
// });
