import { RouteType, RouteDirection, CounterType, BookingClass, AccountType, DiscountType } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../prisma/.env') });

import prisma from '../src/utils/prisma';

async function main() {
    console.log("Starting full database seeding...");

    // STATIONS
    const stations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'];
    const stationRecords: any = {};
    for (const st of stations) {
        let station = await prisma.station.findFirst({ where: { name: st } });
        if (!station) {
            station = await prisma.station.create({ data: { name: st, isActive: true, isSegment: false } });
            console.log(`[STATION] Created:`, station);
        }
        stationRecords[st] = station;
    }
    
    // COUNTER
    let counter = await prisma.counter.findFirst({ where: { name: 'Chittagong Counter' } });
    if (!counter) {
        counter = await prisma.counter.create({
            data: { type: CounterType.Own_Counter, name: 'Chittagong Counter', address: 'Dampara, Chittagong', mobile: '01000000002', primaryContactPersonName: 'Manager CTG', stationId: stationRecords['Chittagong'].id, status: true, isSmsSend: false }
        });
        console.log(`[COUNTER] Created:`, counter);
    }

    // ROUTE
    let route = await prisma.route.findFirst({ where: { routeName: 'Dhaka-Chittagong' } });
    if (!route) {
        route = await prisma.route.create({
            data: { routeName: 'Dhaka-Chittagong', from: stationRecords['Dhaka'].id, to: stationRecords['Chittagong'].id, routeType: RouteType.Local, routeDirection: RouteDirection.Up_Way }
        });
        console.log(`[ROUTE] Created:`, route);
    }

    // SEATPLAN
    let seatPlan = await prisma.seatPlan.findFirst({ where: { name: 'Standard 40 Seat' } });
    if (!seatPlan) {
        seatPlan = await prisma.seatPlan.create({ data: { name: 'Standard 40 Seat', noOfSeat: 40 } });
        console.log(`[SEATPLAN] Created:`, seatPlan);
    }

    // COACH
    let headOfficeCounter = await prisma.counter.findFirst({ where: { type: CounterType.Head_Office } });
    let coach = await prisma.coach.findUnique({ where: { coachNo: 'DH-CTG-01' } });
    if (!coach && headOfficeCounter && route && seatPlan && counter) {
        coach = await prisma.coach.create({
            data: { coachNo: 'DH-CTG-01', schedule: '10:00 AM', routeId: route.id, fromCounterId: headOfficeCounter.id, destinationCounterId: counter.id, seatPlanId: seatPlan.id, coachClass: BookingClass.B_Class, coachType: 'AC', type: 'Daily', active: true }
        });
        console.log(`[COACH] Created:`, coach);
    }

    // VEHICLE
    let vehicle = await prisma.vehicle.findUnique({ where: { registrationNo: 'DHAKA-METRO-B-11-2233' } });
    if (!vehicle) {
        vehicle = await prisma.vehicle.create({ data: { registrationNo: 'DHAKA-METRO-B-11-2233', manufacturerCompany: 'Hino', model: 'AK1J', active: true } });
        console.log(`[VEHICLE] Created:`, vehicle);
    }

    // DRIVER
    let driver = await prisma.driver.findUnique({ where: { contactNo: '01711111111' } });
    if (!driver) {
        driver = await prisma.driver.create({ data: { name: 'Rohim Driver', contactNo: '01711111111', licenseNumber: 'BD-12345', active: true } });
        console.log(`[DRIVER] Created:`, driver);
    }

    // HELPER
    let helper = await prisma.helper.findUnique({ where: { contactNo: '01722222222' } });
    if (!helper) {
        helper = await prisma.helper.create({ data: { name: 'Korim Helper', contactNo: '01722222222', active: true } });
        console.log(`[HELPER] Created:`, helper);
    }

    // SCHEDULE
    let schedule = await prisma.schedule.findFirst({ where: { time: '10:00 AM' } });
    if (!schedule) {
        schedule = await prisma.schedule.create({ data: { time: '10:00 AM' } });
        console.log(`[SCHEDULE] Created:`, schedule);
    }

    // SEATS
    const seatNames = ['A1', 'A2', 'B1', 'B2'];
    for (const name of seatNames) {
        let seat = await prisma.seat.findUnique({ where: { name } });
        if (!seat) {
            seat = await prisma.seat.create({ data: { name } });
            console.log(`[SEAT] Created:`, seat);
        }
    }

    // COACH CONFIG
    if (coach && vehicle) {
        let coachConfig = await prisma.coachConfig.findFirst({ where: { coachNo: coach.coachNo, departureDate: '2026-12-01' } });
        if (!coachConfig) {
            coachConfig = await prisma.coachConfig.create({
                data: { coachNo: coach.coachNo, departureDate: '2026-12-01', registrationNo: vehicle.registrationNo, seatAvailable: 40, active: true }
            });
            console.log(`[COACH_CONFIG] Created:`, coachConfig);
        }
    }

    // CUSTOMER
    let customer = await prisma.customer.findUnique({ where: { phone: '01888888888' } });
    if (!customer) {
        customer = await prisma.customer.create({ data: { name: 'Test Customer', phone: '01888888888', isActive: true } });
        console.log(`[CUSTOMER] Created:`, customer);
    }

    // ACCOUNT
    let account = await prisma.account.findFirst({ where: { accountNumber: '123456789' } });
    if (!account) {
        account = await prisma.account.create({ data: { bankName: 'Bkash', accountHolderName: 'Company Name', accountName: 'Bkash Merchant', accountNumber: '123456789', accountType: AccountType.MobileBanking, openingBalance: 5000, currentBalance: 5000 } });
        console.log(`[ACCOUNT] Created:`, account);
    }

    // EXPENSE CATEGORY
    let expCategory = await prisma.expenseCategory.findFirst({ where: { name: 'Maintenance' } });
    if (!expCategory) {
        expCategory = await prisma.expenseCategory.create({ data: { name: 'Maintenance' } });
        console.log(`[EXPENSE_CATEGORY] Created:`, expCategory);
    }

    // FARE
    if (route && seatPlan) {
        let fare = await prisma.fare.findFirst({ where: { routeId: route.id, seatPlanId: seatPlan.id } });
        if (!fare) {
            fare = await prisma.fare.create({ data: { routeId: route.id, seatPlanId: seatPlan.id, type: 'AC' } });
            console.log(`[FARE] Created:`, fare);
        }

        let segmentFare = await prisma.segmentFare.findFirst({ where: { fareId: fare.id } });
        if (!segmentFare) {
            segmentFare = await prisma.segmentFare.create({ data: { fareId: fare.id, fromStationId: stationRecords['Dhaka'].id, toStationId: stationRecords['Chittagong'].id, amount: 800, isActive: true } });
            console.log(`[SEGMENT_FARE] Created:`, segmentFare);
        }
    }

    // CMS DATA
    let blogCat = await prisma.blogCategory.findFirst({ where: { name: 'News' } });
    if (!blogCat) {
        blogCat = await prisma.blogCategory.create({ data: { name: 'News' } });
        console.log(`[BLOG_CATEGORY] Created:`, blogCat);
    }

    let blog = await prisma.blog.findFirst({ where: { slug: 'welcome-blog' } });
    if (!blog && blogCat) {
        blog = await prisma.blog.create({ data: { title: 'Welcome to Ticketing', slug: 'welcome-blog', author: 'Admin', categoryId: blogCat.id, content: 'This is the first blog post.', image: 'https://via.placeholder.com/150' } });
        console.log(`[BLOG] Created:`, blog);
    }

    let faq = await prisma.fAQ.findFirst({ where: { question: 'How to book?' } });
    if (!faq) {
        faq = await prisma.fAQ.create({ data: { question: 'How to book?', answer: 'You can book online or at counters.' } });
        console.log(`[FAQ] Created:`, faq);
    }

    console.log("Full database seeding completed successfully!");
}

main().catch((e) => { console.error("Error during full data seeding:", e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
