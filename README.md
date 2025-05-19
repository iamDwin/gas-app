# Gas Management System

A modern web application for managing gas declarations, allocations, and contracts. Built with Angular 18 and Tailwind CSS.

## Features

- 🔐 **Authentication & Authorization**

  - Email/password login
  - Role-based access control
  - Password reset functionality
  - Session persistence

- 📊 **Dashboard**

  - Overview of key metrics
  - Quick access to main features
  - Real-time pending items count
  - Interactive statistics cards

- 🏢 **Organizations Management**

  - Create/Edit/Delete organizations
  - Organization approval workflow
  - Upstream/Downstream categorization
  - Pending approvals management

- 👥 **User Management**

  - User roles and permissions
  - Organization assignment
  - User activity tracking
  - Profile management

- 📝 **Declarations**

  - Create and manage declarations
  - Multi-step approval process
  - Status tracking
  - Document attachments

- 📋 **Allocations & Nominations**

  - Gas allocation management
  - Nomination tracking
  - Approval workflows
  - Historical data

- 📄 **Contracts**

  - Contract management
  - Version control
  - Approval process
  - Document storage

- 📊 **Reports**
  - Custom report generation
  - Data export
  - Analytics dashboard
  - Trend analysis

## Technical Architecture

### Core Module (`/src/app/core`)

- **Authentication**

  - `auth.service.ts` - Handles user authentication and session management
  - `auth.guard.ts` - Route protection based on authentication status
  - `role.guard.ts` - Route protection based on user roles

- **Services**
  - `loading.service.ts` - Global loading state management
  - Other core services for application-wide functionality

### Feature Modules (`/src/app/features`)

- **Auth**

  - Login component
  - Forgot password component
  - Password reset component

- **Layout**

  - Main application layout
  - Responsive sidebar
  - Navigation menu
  - Breadcrumbs

- **Dashboard**

  - Statistics cards
  - Activity overview
  - Quick actions

- **Organizations**

  - Organization list
  - Organization form
  - Pending approvals

- **Users**

  - User management
  - Role assignment
  - User profiles

- **Declarations**

  - Declaration management
  - Approval workflow
  - Status tracking

- **Other Features**
  - Allocations
  - Nominations
  - Contracts
  - Reports

### Shared Module (`/src/app/shared`)

- **Components**

  - `data-table` - Reusable table component with sorting and filtering
  - `button` - Customizable button component
  - `drawer` - Slide-in panel component
  - `confirmation-modal` - Confirmation dialog
  - `breadcrumb` - Navigation breadcrumbs
  - `notifications` - Toast notifications
  - `loading` - Loading spinner overlay

- **Services**
  - `breadcrumb.service.ts` - Breadcrumb management
  - `notification.service.ts` - Toast notifications
  - `toast.service.ts` - Toast message management
  - `pending-items.service.ts` - Pending items counter

### Styling

- Tailwind CSS for utility-first styling
- Custom theme configuration
- Responsive design
- Dark/light mode support

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── guards/
│   │   └── services/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── organizations/
│   │   ├── users/
│   │   └── ...
│   └── shared/
│       ├── components/
│       └── services/
├── environments/
└── assets/
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:4200`

## Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

The application is configured for deployment to Netlify. The `netlify.toml` file contains the necessary configuration for:

- Build settings
- Redirect rules
- Environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## charts plugin

https://github.com/valor-software/ng2-charts
