# 🔐 Cognident Sample Login Credentials

## 📱 **FOR TABLET TESTING**

Use these credentials to test all dashboards on your tablet. All passwords are simple for demo purposes.

---

## 🇺🇸 **ENGLISH/AMERICAN DASHBOARDS**

### **👨‍⚕️ DENTIST/DOCTOR LOGINS**
**Login URL:** `/auth/dentist/signin` or `/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `dentist@cognident.org` | `dentist123` | Dr. Michael Chen | Dentist Dashboard |

---

### **🏥 RECEPTIONIST LOGINS**
**Login URL:** `/auth/signin` or `/receptionist` (redirects to login)

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `receptionist@cognident.org` | `reception123` | Maria Rodriguez | Receptionist Dashboard |

---

### **👩‍⚕️ HYGIENIST LOGINS**
**Login URL:** `/auth/employee/signin` or `/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `hygienist@cognident.org` | `hygienist123` | Ashley Williams | Employee Dashboard |

---

### **👨‍💼 ASSISTANT LOGINS**
**Login URL:** `/auth/employee/signin` or `/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `assistant@cognident.org` | `assistant123` | Lisa Wilson | Employee Dashboard |

---

### **👔 MANAGER LOGINS**
**Login URL:** `/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `manager@cognident.org` | `manager123` | Michael Brown | Manager Dashboard |

---

### **🔧 ADMIN LOGINS**
**Login URL:** `/auth/signin` or `/admin/login`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `admin@cognident.org` | `admin123` | Dr. Sarah Martinez | Admin Dashboard |

---

### **🧑‍🦲 PATIENT LOGINS**
**Login URL:** `/auth/patient/signin` or `/patient/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `patient@cognident.org` | `patient123` | John Smith | Patient Dashboard |
| `emily.patient@cognident.org` | `patient123` | Emily Johnson | Patient Dashboard |

---

## 🇲🇽 **SPANISH/MEXICAN DASHBOARDS**

### **👨‍⚕️ DENTISTA LOGINS**
**Login URL:** `/es/auth/signin` (Mexican flag design)

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `dentist.es@cognident.org` | `dentista123` | Dr. Carlos Rodriguez | Mexican Dentist Dashboard |

---

### **🏥 RECEPCIONISTA LOGINS**
**Login URL:** `/es/auth/signin` or `/es/receptionist`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `recepcionista@cognident.org` | `recepcion123` | Ana Martinez | Mexican Receptionist Dashboard |

---

### **👨‍💼 ASISTENTE LOGINS**
**Login URL:** `/es/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `asistente@cognident.org` | `asistente123` | Roberto Lopez | Mexican Assistant Dashboard |

---

### **🧑‍🦲 PACIENTE LOGINS**
**Login URL:** `/es/auth/signin`

| Email | Password | Name | Dashboard |
|-------|----------|------|-----------|
| `paciente@cognident.org` | `paciente123` | Miguel Hernandez | Mexican Patient Dashboard |

---

## 🎯 **QUICK TEST URLS FOR TABLET**

### **Main Landing Pages:**
- **English:** `https://yourdomain.com/`
- **Spanish/Mexican:** `https://yourdomain.com/es/`

### **Login Pages:**
- **Main Login:** `https://yourdomain.com/auth/signin`
- **Mexican Login:** `https://yourdomain.com/es/auth/signin` ⭐ **Special Mexican Design**
- **Patient Login:** `https://yourdomain.com/patient/auth/signin`
- **Admin Login:** `https://yourdomain.com/admin/login`

### **Direct Dashboard Access:**
- **Receptionist:** `https://yourdomain.com/receptionist`
- **Mexican Receptionist:** `https://yourdomain.com/es/receptionist` ⭐ **Mexican Design**
- **Patient Dashboard:** `https://yourdomain.com/patient/dashboard`

---

## 🔍 **TESTING CHECKLIST**

### ✅ **Test Each Role:**
- [ ] Dentist/Doctor dashboard functionality
- [ ] Receptionist dashboard (English & Spanish)
- [ ] Patient portal (English & Spanish)
- [ ] Admin panel access
- [ ] Assistant/Hygienist employee dashboards
- [ ] Manager dashboard

### ✅ **Test Mexican Features:**
- [ ] Mexican flag background on `/es/auth/signin`
- [ ] Spanish language interface
- [ ] Green/white/red color scheme
- [ ] Cultural dental imagery

### ✅ **Test Responsive Design:**
- [ ] All forms work on tablet
- [ ] Touch-friendly buttons
- [ ] Proper scaling on different orientations
- [ ] Navigation menus work properly

---

## 🚨 **IMPORTANT NOTES**

1. **All passwords are simple for demo purposes** - Change in production!
2. **Mexican login page** (`/es/auth/signin`) has special cultural design
3. **Auto-redirect** - Users are automatically redirected to their role-specific dashboard
4. **Cross-language** - You can test switching between English and Spanish interfaces
5. **Tablet optimized** - All interfaces are responsive and touch-friendly

---

## 🛠 **If You Need More Users**

Run this command to create additional sample users:
```bash
npm run create-sample-users
```

The script will skip existing users and only create new ones.
