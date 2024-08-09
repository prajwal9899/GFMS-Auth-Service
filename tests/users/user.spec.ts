// import { DataSource } from 'typeorm';
// import { AppDataSource } from '../../src/config/data-source';
// import app from '../../src/app';
// import request from 'supertest';
// import createJWKSMock from 'mock-jwks';
// import { User } from '../../src/entity/User';
// import { Roles } from '../../src/constants';

// describe('GET /auth/self', () => {
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
//     it('Should return 200 status code', async () => {
//       const accessToken = jwks.token({ sub: '1', role: Roles.CUSTOMER });
//       const response = await request(app)
//         .get('/auth/self')
//         .set('Cookie', [`accessToken=${accessToken}`])
//         .send();
//       expect(response.statusCode).toBe(200);
//     });

//     it('Should return user data', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };

//       const userRepository = connection.getRepository(User);
//       const data = await userRepository.save({
//         ...userData,
//         role: Roles.CUSTOMER,
//       });
//       const accessToken = jwks.token({ sub: String(data.id), role: data.role });
//       await request(app).post('/auth/register').send(userData);

//       const response = await request(app)
//         .get('/auth/self')
//         .set('Cookie', [`accessToken=${accessToken};`])
//         .send();
        
//       expect(response.body.id).toBe(data.id);
//     });

//     it('Should not return password field', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };

//       const userRepository = connection.getRepository(User);
//       const data = await userRepository.save({
//         ...userData,
//         role: Roles.CUSTOMER,
//       });
//       const accessToken = jwks.token({ sub: String(data.id), role: data.role });
//       await request(app).post('/auth/register').send(userData);

//       const response = await request(app)
//         .get('/auth/self')
//         .set('Cookie', [`accessToken=${accessToken}`])
//         .send();

//       expect(response.body).not.toHaveProperty('password');
//     });

//     it('Should return 401 status code if token does not exists', async () => {
//       const userData = {
//         firstName: 'Prajwal',
//         lastName: 'Gadge',
//         email: 'prajwal@gmail.com',
//         password: 'prajwal123',
//       };

//       const userRepository = connection.getRepository(User);
//       await userRepository.save({
//         ...userData,
//         role: Roles.CUSTOMER,
//       });
//       await request(app).post('/auth/register').send(userData);

//       const response = await request(app).get('/auth/self').send();

//       expect(response.statusCode).toBe(401);
//     });
    
//   });
// });
