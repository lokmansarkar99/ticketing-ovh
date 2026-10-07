import { CounterType, BookingStatus, BookingClass } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../prisma/.env') });

import prisma from '../src/utils/prisma';

async function main() {
    console.log("Starting user seeding...");

    // 1. Create Roles
    const roles = ['ADMIN', 'DEVELOPER', 'SUPERVISOR', 'COUNTER'];
    const roleRecords: any = {};
    for (const roleName of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
        roleRecords[roleName] = role.id;
        console.log(`[ROLE] ${roleName} ensured:`, role);
    }

    // 2. Create Head Office Station
    let headOfficeStation = await prisma.station.findFirst({
        where: { name: 'Head Office Station' }
    });
    if (!headOfficeStation) {
        headOfficeStation = await prisma.station.create({
            data: {
                name: 'Head Office Station',
                isSegment: false,
                isActive: true
            }
        });
        console.log(`[STATION] Head Office Station created:`, headOfficeStation);
    }

    // 3. Create Head Office Counter
    let headOfficeCounter = await prisma.counter.findFirst({
        where: { name: 'Head Office Counter' }
    });
    if (!headOfficeCounter) {
        headOfficeCounter = await prisma.counter.create({
            data: {
                type: CounterType.Head_Office,
                name: 'Head Office Counter',
                address: 'Dhaka, Bangladesh',
                mobile: '01000000000',
                primaryContactPersonName: 'Admin',
                stationId: headOfficeStation.id,
                status: true,
                isSmsSend: false,
                bookingAllowStatus: BookingStatus.Total,
                bookingAllowClass: BookingClass.B_Class,
            }
        });
        console.log(`[COUNTER] Head Office Counter created:`, headOfficeCounter);
    }

    // 4. Create Users
    const adminEmail = process.env.ADMIN_USER || 'admin@ticketing.com';
    const adminPassword = process.env.ADMIN_PASS || 'admin123';
    
    const usersToCreate = [
        {
            userName: 'admin',
            email: adminEmail,
            password: adminPassword,
            roleId: roleRecords['ADMIN'],
            contactNo: '01704661571',
        },
        {
            userName: 'developer',
            email: 'lokmansarkar609@gmail.com',
            password: 'password123',
            roleId: roleRecords['DEVELOPER'],
            contactNo: '01000000002',
        },
        {
            userName: 'supervisor',
            email: 'lokmansarkar608@gmail.com',
            password: 'password123',
            roleId: roleRecords['SUPERVISOR'],
            contactNo: '01000000003',
        },
        {
            userName: 'counterman',
            email: 'ilovems336@gmail.com',
            password: 'password123',
            roleId: roleRecords['COUNTER'],
            contactNo: '01000000004',
        }
    ];

    for (const userData of usersToCreate) {
        const existingUser = await prisma.user.findFirst({
            where: { userName: userData.userName }
        });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            const createdUser = await prisma.user.create({
                data: {
                    userName: userData.userName,
                    email: userData.email,
                    password: hashedPassword,
                    roleId: userData.roleId,
                    counterId: headOfficeCounter.id,
                    contactNo: userData.contactNo,
                    active: true,
                    permission: {
                        create: {
                            board: true,
                            aifs: true,
                            canViewAllCoachInvoice: true,
                            bookingPermission: true,
                            ticketCancel: true,
                            seatTransfer: true,
                            coachActiveInActive: true,
                            blockDiscount: true,
                            showDiscountMenu: true,
                            showDiscountFromDate: new Date(),
                            showDiscountEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
                            vipSeatAllowToSale: true,
                            showOwnCounterBoardingPoint: true,
                            showOwnCounterSalesInTripSheet: true,
                            isPrepaid: false
                        }
                    }
                }
            });
            console.log(`[USER] Created:`, createdUser);
        } else {
            console.log(`[USER] Already exists: ${userData.userName}`);
        }
    }

    console.log("User seeding completed successfully!");
}

main().catch((e) => { console.error("Error during user seeding:", e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
