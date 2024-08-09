// import request from 'supertest';
// import app from '../../src/app';
// import { DataSource } from 'typeorm';
// import { AppDataSource } from '../../src/config/data-source';
// import { isJwt } from '../utils';
// import { User } from '../../src/entity/User';
// import { Roles } from '../../src/constants';
// import { RefreshToken } from '../../src/entity/RefreshToken';

// describe('POST /auth/register', () => {
//   let connection: DataSource;

//   beforeAll(async () => {
//     connection = await AppDataSource.initialize();
//   });

//   beforeEach(async () => {
//     // Truncate Database
//     await connection.dropDatabase();
//     await connection.synchronize();
//     // await truncateTables(connection)
//   });

//   afterAll(async () => {
//     await connection.destroy();
//   });

//   describe('Given all fields', () => {
//     it('should return 201 status code', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       const response = await request(app).post('/auth/register').send(userData);
//       expect(response.statusCode).toBe(201);
//     });

//     it('it should return valid JSON response', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       const response = await request(app).post('/auth/register').send(userData);
//       expect(
//         (response.header as Record<string, string>)['content-type'],
//       ).toEqual(expect.stringContaining('json'));
//     });

//     it('it should persist the user in the database', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       await request(app).post('/auth/register').send(userData);
//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find();
//       expect(users).toHaveLength(1);
//       expect(users[0].firstName).toBe(userData.firstName);
//       expect(users[0].lastName).toBe(userData.lastName);
//       expect(users[0].email).toBe(userData.email);
//     });

//     it('it should assign a customer role', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       await request(app).post('/auth/register').send(userData);
//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find();
//       expect(users[0]).toHaveProperty('role');
//       expect(users[0].role).toBe(Roles.CUSTOMER);
//     });

//     it('should store hashed password in database', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       await request(app).post('/auth/register').send(userData);
//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find({ select: ['password'] });

//       expect(users[0].password).not.toBe(userData.password);
//       expect(users[0].password).toHaveLength(60);
//       expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
//     });

//     it('Email should return 400 status code if email already exists in database', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       const userRepository = connection.getRepository(User);
//       await userRepository.save({ ...userData, role: Roles.CUSTOMER });

//       const users = await userRepository.find();

//       const response = await request(app).post('/auth/register').send(userData);

//       expect(response.statusCode).toBe(400);
//       expect(users).toHaveLength(1);
//     });

//     it('It should return access token and refresh token in cookie', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };

//       interface Headers {
//         ['set-cookie']: string[];
//       }

//       const response = await request(app).post('/auth/register').send(userData);

//       let accessToken = null;
//       let refreshToken = null;
//       const cookies =
//         (response.headers as unknown as Headers)['set-cookie'] || [];

//       cookies.forEach((cookie) => {
//         if (cookie.startsWith('accessToken=')) {
//           accessToken = cookie.split(';')[0].split('=')[1];
//         }

//         if (cookie.startsWith('refreshToken=')) {
//           refreshToken = cookie.split(';')[0].split('=')[1];
//         }
//       });

//       expect(accessToken).not.toBeNull();
//       expect(refreshToken).not.toBeNull();

//       expect(isJwt(accessToken)).toBeTruthy();
//       expect(isJwt(refreshToken)).toBeTruthy();
//     });

//     it('should store refresh token in database', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };
//       const response = await request(app).post('/auth/register').send(userData);
//       const refreshTokenRepository = connection.getRepository(RefreshToken);
//       const tokens = await refreshTokenRepository
//         .createQueryBuilder('refreshToken')
//         .where('refreshToken.userId = :userId', {
//           userId: (response.body as Record<string, string>).id,
//         })
//         .getMany();

//       expect(tokens).toHaveLength(1);
//     });
//   });

//   describe('Fields are missing', () => {
//     it('should return status code 400 if email field is missing', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: '',
//         password: 'prajwal123',
//       };

//       const response = await request(app).post('/auth/register').send(userData);

//       expect(response.statusCode).toBe(400);
//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find();
//       expect(users).toHaveLength(0);
//     });

//     // it('should return status code 400 if firstName field is missing', async () => {
//     //   const userData = {
//     //     firstName: 'Prajwal',
//     //     lastName: 'Gadge',
//     //     email: '',
//     //     password: 'prajwal123',
//     //   };

//     //   const response = await request(app).post('/auth/register').send(userData);

//     //   expect(response.statusCode).toBe(400);
//     //   const userRepository = connection.getRepository(User);
//     //   const users = await userRepository.find();
//     //   expect(users).toHaveLength(0);
//     // });

//     // it('should return status code 400 if lastName field is missing', async () => {
//     //   const userData = {
//     //     firstName: 'Prajwal',
//     //     lastName: 'Gadge',
//     //     email: '',
//     //     password: 'prajwal123',
//     //   };

//     //   const response = await request(app).post('/auth/register').send(userData);

//     //   expect(response.statusCode).toBe(400);
//     //   const userRepository = connection.getRepository(User);
//     //   const users = await userRepository.find();
//     //   expect(users).toHaveLength(0);
//     // });

//     // it('should return status code 400 if password field is missing', async () => {
//     //   const userData = {
//     //     firstName: 'Prajwal',
//     //     lastName: 'Gadge',
//     //     email: '',
//     //     password: 'prajwal123',
//     //   };

//     //   const response = await request(app).post('/auth/register').send(userData);

//     //   expect(response.statusCode).toBe(400);
//     //   const userRepository = connection.getRepository(User);
//     //   const users = await userRepository.find();
//     //   expect(users).toHaveLength(0);
//     // });
//   });

//   describe('Fields are not in proper format', () => {
//     it('should trim the email field', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: ' prajwal1@gmail.com ',
//         password: 'prajwal123',
//       };

//       await request(app).post('/auth/register').send(userData);

//       const userRepository = connection.getRepository(User);
//       const users = await userRepository.find();
//       const user = users[0];
//       expect(user.email).toBe('prajwal1@gmail.com');
//     });

//     it.todo('400 status if email is not valid');
//   });
// });
