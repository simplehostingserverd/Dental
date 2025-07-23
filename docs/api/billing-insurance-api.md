# Comprehensive Billing & Insurance API Documentation

## Overview

This document describes the complete API endpoints for the Cognident Dental Practice Management System's billing and insurance functionality. All endpoints are production-ready and fully operational.

## Base URL
```
https://cognident.org/api/dashboard
```

## Authentication
All endpoints require authentication. Include the session token in your requests.

---

## 🏥 Insurance Management APIs

### Insurance Payers

#### GET /insurance/payers
Get all insurance payers for the practice.

**Query Parameters:**
- `type` (optional): Filter by payer type (PRIMARY, SECONDARY, TERTIARY)
- `isActive` (optional): Filter by active status (true/false)

**Response:**
```json
{
  "payers": [
    {
      "id": "payer-delta-dental",
      "name": "Delta Dental",
      "type": "PRIMARY",
      "payerCode": "DELTA001",
      "address": "100 First Street",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "phone": "(800) 765-6003",
      "email": "providers@deltadental.com",
      "website": "https://www.deltadental.com",
      "isActive": true,
      "contractedRates": {
        "preventive": 100,
        "basic": 80,
        "major": 50,
        "orthodontic": 50
      },
      "_count": {
        "claims": 15,
        "eligibilityChecks": 8,
        "patientInsurances": 25
      }
    }
  ]
}
```

#### POST /insurance/payers
Create a new insurance payer.

**Request Body:**
```json
{
  "name": "Cigna Dental",
  "type": "PRIMARY",
  "payerCode": "CIGNA001",
  "address": "900 Cottage Grove Road",
  "city": "Bloomfield",
  "state": "CT",
  "zipCode": "06002",
  "phone": "(800) 244-6224",
  "email": "providers@cigna.com",
  "website": "https://www.cigna.com",
  "contractedRates": {
    "preventive": 100,
    "basic": 70,
    "major": 50,
    "orthodontic": 50
  }
}
```

#### GET /insurance/payers/[id]
Get specific insurance payer details.

#### PUT /insurance/payers/[id]
Update insurance payer information.

#### DELETE /insurance/payers/[id]
Delete insurance payer (only if no associated data).

### Clearinghouses

#### GET /insurance/clearinghouses
Get all clearinghouses configured for the practice.

#### POST /insurance/clearinghouses
Create a new clearinghouse connection.

**Request Body:**
```json
{
  "name": "DentalXChange",
  "type": "DENTAL",
  "apiEndpoint": "https://api.dentalxchange.com/v1",
  "username": "cognident_user",
  "password": "secure_password",
  "submitterId": "COGNI001",
  "receiverId": "DXC001",
  "supportedTransactions": ["270", "271", "276", "277", "837", "835"],
  "testMode": false
}
```

### Eligibility Verification

#### GET /insurance/eligibility
Get eligibility check history.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `payerId` (optional): Filter by insurance payer
- `status` (optional): Filter by status (PENDING, VERIFIED, FAILED, EXPIRED)

#### POST /insurance/eligibility
Perform real-time eligibility verification.

**Request Body:**
```json
{
  "patientId": "patient-john-doe",
  "payerId": "payer-delta-dental",
  "patientInsuranceId": "ins-john-delta",
  "serviceDate": "2024-07-23"
}
```

**Response:**
```json
{
  "eligibilityCheck": {
    "id": "elig-check-123",
    "status": "VERIFIED",
    "copay": 25.00,
    "deductible": 50.00,
    "deductibleRemaining": 25.00,
    "annualMaximum": 1500.00,
    "benefitsRemaining": 850.00,
    "coveragePercentages": {
      "preventive": 100,
      "basic": 80,
      "major": 50,
      "orthodontic": 50
    }
  }
}
```

---

## 📋 Claims Management APIs

### Claims

#### GET /claims
Get all claims for the practice.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `payerId` (optional): Filter by insurance payer
- `status` (optional): Filter by claim status
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "claims": [
    {
      "id": "claim-john-cleaning",
      "claimNumber": "CLM-2024-001",
      "patientName": "John Doe",
      "payerName": "Delta Dental",
      "serviceDate": "2024-01-15",
      "submissionDate": "2024-01-16",
      "totalAmount": 250.00,
      "paidAmount": 200.00,
      "patientResponsibility": 50.00,
      "status": "PAID",
      "eobReceived": true,
      "procedures": [
        {
          "procedureCode": "D1110",
          "description": "Adult Prophylaxis",
          "chargedAmount": 150.00,
          "paidAmount": 150.00
        }
      ]
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### POST /claims
Create a new insurance claim.

**Request Body:**
```json
{
  "patientId": "patient-john-doe",
  "payerId": "payer-delta-dental",
  "patientInsuranceId": "ins-john-delta",
  "clearinghouseId": "ch-dentalxchange",
  "serviceDate": "2024-07-23",
  "totalAmount": 350.00,
  "procedures": [
    {
      "procedureCode": "D2391",
      "description": "Composite Filling - One Surface",
      "tooth": "14",
      "quantity": 1,
      "chargedAmount": 350.00
    }
  ]
}
```

#### POST /claims/[id]/submit
Submit claim to clearinghouse for processing.

**Response:**
```json
{
  "claim": {
    "id": "claim-123",
    "status": "SUBMITTED",
    "controlNumber": "CTRL-1721692879-ABC123"
  },
  "message": "Claim submitted successfully",
  "controlNumber": "CTRL-1721692879-ABC123"
}
```

---

## 💳 Patient Financing APIs

### Financing Options

#### GET /financing/options
Get all financing options available to patients.

**Query Parameters:**
- `provider` (optional): Filter by provider (CARECREDIT, LENDING_CLUB, ALPHAEON, INTERNAL)
- `type` (optional): Filter by type (PROMOTIONAL, STANDARD, PAYMENT_PLAN)
- `isActive` (optional): Filter by active status

#### POST /financing/options
Create a new financing option.

**Request Body:**
```json
{
  "provider": "CARECREDIT",
  "name": "CareCredit 12-Month Promotional",
  "type": "PROMOTIONAL",
  "minAmount": 200,
  "maxAmount": 25000,
  "termMonths": 12,
  "interestRate": 26.99,
  "promotionalRate": 0,
  "promotionalMonths": 12,
  "applicationUrl": "https://www.carecredit.com/apply",
  "apiEndpoint": "https://api.carecredit.com/v1",
  "apiKey": "encrypted_api_key"
}
```

### Financing Applications

#### GET /financing/applications
Get all patient financing applications.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `status` (optional): Filter by status (PENDING, APPROVED, DECLINED, ACTIVE, COMPLETED, DEFAULTED)
- `provider` (optional): Filter by financing provider

#### POST /financing/applications
Submit a new financing application for a patient.

**Request Body:**
```json
{
  "patientId": "patient-mike-johnson",
  "financingOptionId": "fin-carecredit-promo",
  "amount": 2500.00,
  "termMonths": 12
}
```

**Response:**
```json
{
  "application": {
    "id": "app-123",
    "applicationId": "APP-1721692879-XYZ789",
    "status": "PENDING",
    "amount": 2500.00,
    "monthlyPayment": 208.33,
    "patient": {
      "firstName": "Mike",
      "lastName": "Johnson"
    },
    "financingOption": {
      "provider": "CARECREDIT",
      "name": "CareCredit 12-Month Promotional",
      "applicationUrl": "https://www.carecredit.com/apply"
    }
  }
}
```

---

## 💰 Billing & Payments APIs

### General Ledger

#### GET /billing/ledger
Get ledger entries (transaction history).

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `type` (optional): Filter by transaction type
- `status` (optional): Filter by status
- `startDate` (optional): Filter by date range
- `endDate` (optional): Filter by date range

#### POST /billing/ledger
Create a new ledger entry.

**Request Body:**
```json
{
  "patientId": "patient-john-doe",
  "type": "CHARGE",
  "description": "Routine Cleaning and Exam",
  "procedureCode": "D1110",
  "amount": 250.00,
  "transactionDate": "2024-07-23",
  "notes": "Regular 6-month cleaning"
}
```

### Accounts Receivable

#### GET /billing/accounts-receivable
Get accounts receivable aging report.

**Response:**
```json
{
  "accountsReceivable": [
    {
      "id": "ar-john-doe",
      "patientName": "John Doe",
      "totalBalance": 1250.00,
      "insuranceBalance": 875.00,
      "patientBalance": 375.00,
      "currentBalance": 1000.00,
      "days30Balance": 250.00,
      "days60Balance": 0.00,
      "days90Balance": 0.00,
      "days120PlusBalance": 0.00,
      "collectionStatus": "CURRENT",
      "paymentPlan": false,
      "lastPaymentDate": "2024-01-15",
      "lastPaymentAmount": 50.00
    }
  ],
  "agingSummary": {
    "totalAccounts": 3,
    "totalBalance": 4200.00,
    "currentBalance": 3050.00,
    "days30Balance": 1150.00,
    "days60Balance": 0.00,
    "days90Balance": 0.00,
    "days120PlusBalance": 0.00,
    "insuranceBalance": 1470.00,
    "patientBalance": 2730.00
  }
}
```

#### POST /billing/accounts-receivable/refresh
Refresh A/R calculations for all patients.

### Patient Invoices

#### GET /billing/invoices
Get patient invoices.

#### POST /billing/invoices
Create a new patient invoice.

**Request Body:**
```json
{
  "patientId": "patient-mike-johnson",
  "serviceDate": "2024-07-23",
  "dueDate": "2024-08-23",
  "procedures": [
    {
      "procedureCode": "D2740",
      "description": "Porcelain Crown",
      "tooth": "19",
      "quantity": 1,
      "unitPrice": 1200.00
    }
  ],
  "notes": "Crown treatment completed"
}
```

### Payment Processing

#### GET /billing/payments
Get payment history.

#### POST /billing/payments
Record a new payment.

**Request Body:**
```json
{
  "patientId": "patient-john-doe",
  "amount": 150.00,
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "txn_1234567890",
  "invoiceId": "invoice-123",
  "notes": "Payment for crown treatment",
  "paymentDate": "2024-07-23"
}
```

---

## 🔒 Security & Compliance

- All endpoints require proper authentication
- PHI data is encrypted and HIPAA compliant
- Audit trails are maintained for all transactions
- Role-based access control is enforced
- API rate limiting is implemented

## 📊 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be positive"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚀 Production Ready

This API is fully operational and production-ready for:
- Real dental practices
- Live patient data
- Insurance claim processing
- Payment processing
- Financial reporting
- Compliance requirements

All endpoints have been tested and are ready for immediate use in a production environment.
