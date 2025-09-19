# Character Table Demo - Frontend Engineering Assignment

A performant React table application built with TanStack Table, featuring character data management with selection, filtering, sorting, and searching capabilities.

## 🚀 Features

### Core Functionality

- **High-Performance Table**: Renders 1000+ character entries efficiently using TanStack Table
- **Row Selection**: Checkbox-based selection with "Select All" functionality
- **Real-time Search**: Search characters by name or location with instant filtering
- **Health Filtering**: Dropdown filter for character health status (Healthy, Injured, Critical)
- **Power Sorting**: Sortable power column with ascending/descending toggle
- **Submit Action**: Console logging of selected character IDs
- **Loading States**: Proper loading indicators during data fetch
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Technical Features

- **TypeScript**: Fully typed codebase with proper type definitions
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **JSON Server**: Mock API with 1200+ character entries
- **Comprehensive Testing**: Jest/Vitest tests covering all functionality
- **Modular Architecture**: Clean separation of concerns with custom hooks
- **Performance Optimized**: Efficient rendering and state management

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React icons
- **Table Management**: TanStack Table v8
- **Virtualization**: react-virtuoso for performance
- **State Management**: React hooks (useState, useEffect, useMemo)
- **API**: JSON Server for mock data
- **Testing**: Vitest, React Testing Library, Jest DOM
- **Code Quality**: Biome (linting & formatting)

## 📦 Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npm run setup-env:dev
   ```

3. **Generate character data**

   ```bash
   npm run generate-data
   ```

4. **Start the development server and the JSON server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000/demo/table`

## 🎯 Usage

### Table Operations

1. **Search Characters**
   - Use the search input to filter by character name or location
   - Search is case-insensitive and updates in real-time

2. **Select Rows**
   - Click individual checkboxes to select specific characters
   - Use the header checkbox to select/deselect all visible rows
   - Selected count is displayed in the submit button

3. **Filter by Health**
   - Click the filter icon next to "Health" column header
   - Select one or more health statuses (Healthy, Injured, Critical)
   - Multiple selections are supported

4. **Sort by Power**
   - Click the chevron icon next to "Power" column header
   - Toggle between ascending and descending order
   - Visual indicators show current sort direction

5. **Submit Selection**
   - Click "Submit Selected" button to log selected character IDs
   - Button is disabled when no rows are selected
   - Selected IDs are logged to browser console

6. **Virtual Scrolling**
   - Table automatically virtualizes rows using react-virtuoso for optimal performance
   - Only visible rows are rendered in the DOM
   - Smooth scrolling through 1200+ characters
   - Virtualization info displayed at the bottom

## 🧪 Testing

Run the test suite:

```bash
npm test
```

### Test Coverage

- **Component Tests**: Table rendering, interactions, and state management
- **Hook Tests**: Data fetching, error handling, and loading states
- **User Interactions**: Search, selection, filtering, and sorting
- **Accessibility**: ARIA labels and keyboard navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── global/                # Reusable global components
│   │   ├── DataTable.tsx      # Core table with virtualization
│   │   ├── DataTableToolbar.tsx # Search, filters, and actions
│   │   ├── columns.tsx        # Column definitions
│   │   └── __tests__/         # Global component tests
│   ├── pages/                 # Page-specific components
│   │   ├── CharacterTable.tsx # Main table component (orchestrator)
│   │   └── __tests__/         # Page component tests
│   └── __tests__/             # General component tests
├── config/                    # Configuration files
│   ├── api.ts                 # API configuration
│   └── environment.ts         # Environment variables
├── data/
│   ├── characters.ts          # Character data types and generation
│   └── demo-table-data.ts     # Demo data for testing
├── hooks/
│   ├── useCharacters.ts       # Data fetching hook
│   ├── useDebounce.ts         # Debounce utility hook
│   └── __tests__/             # Hook tests
├── integrations/
│   └── tanstack-query/        # TanStack Query setup
│       ├── devtools.tsx       # Query devtools
│       └── root-provider.tsx  # Query provider
├── routes/
│   ├── __root.tsx             # Root route with devtools
│   ├── index.tsx              # Home route (redirects to table)
│   └── demo.table.tsx         # Table demo route
├── lib/
│   └── utils.ts               # Utility functions
├── main.tsx                   # Application entry point
├── styles.css                 # Global styles
└── test-setup.ts              # Test configuration
```

## 🎨 Character Data Schema

```typescript
interface Character {
  id: string; // Unique identifier
  name: string; // Character full name
  location: "Konoha" | "Suna" | "Kiri" | "Iwa" | "Kumo";
  health: "Healthy" | "Injured" | "Critical";
  power: number; // Min: 100, Max: 10,000
  viewed: boolean; // Default: false
}
```

## 🚀 Performance Features

- **react-virtuoso**: Efficient virtualization for rendering 1000+ rows
- **Virtual Scrolling**: Only renders visible rows in the viewport
- **Smart Fallback**: Graceful degradation in test environments
- **Memoized Components**: Optimized re-rendering with React.memo
- **Debounced Search**: Reduced API calls during typing
- **Lazy Loading**: Components loaded on demand
- **Optimized Filters**: Client-side filtering for instant results

## 🏛️ Component Architecture

The table follows the **shadcn/ui tasks example** pattern with clear separation of concerns:

### **CharacterTable** (Orchestrator)

- Main component that coordinates all table functionality
- Manages state for search, filters, and selection
- Handles data filtering and business logic

### **DataTableToolbar** (UI Controls)

- Search input with real-time filtering
- Health status filter dropdown with badges
- Reset filters functionality
- Submit selected button with count

### **DataTable** (Core Table)

- Handles table rendering with TanStack Table
- Implements virtualization with react-virtuoso
- Manages row selection and sorting
- Provides fallback rendering for tests

### **columns.tsx** (Column Definitions)

- Centralized column configuration
- Reusable column definitions
- Type-safe column accessors
- Custom cell renderers and headers

## 🛣️ Routing Structure

The application uses a simplified routing structure:

- **`/`** - Redirects to `/demo/table`
- **`/demo/table`** - Main table demo with all features
- **Root Layout** - Includes TanStack DevTools for development

### **Key Features:**

- **Single Table Element**: Fixed the previous issue of having separate table elements for header and body
- **Sticky Header**: Header stays visible while scrolling through virtualized rows
- **Clean Navigation**: Removed unnecessary routes and header component
- **Direct Access**: Home route automatically redirects to the table demo

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:netlify` - Build for Netlify deployment (includes embedded data)
- `npm run test` - Run test suite
- `npm run json-server` - Start JSON server (development only)
- `npm run generate-data` - Generate character data
- `npm run generate-embedded-data` - Generate embedded data for Netlify functions
- `npm run test:netlify` - Test Netlify function locally
- `npm run setup-env` - Set up environment variables (default: development)
- `npm run setup-env:dev` - Set up development environment variables
- `npm run setup-env:prod` - Set up production environment variables
- `npm run lint` - Run linter
- `npm run format` - Format code

## 🔧 Environment Variables

The application uses environment variables for configuration. Set up your environment:

```bash
# Quick setup for development
npm run setup-env:dev

# Quick setup for production
npm run setup-env:prod
```

### Available Variables

- `VITE_API_BASE_URL` - API server URL (default: auto-detected)
- `VITE_DEV_MODE` - Enable development features
- `VITE_ENABLE_DEVTOOLS` - Enable development tools

See `env.example` for all available variables.

## 🌐 Deployment

The application can be deployed to any static hosting service:

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Ensure JSON server is running** or replace with a real API

## 📝 API Endpoints

- `GET /characters` - Fetch all characters
- `GET /characters/:id` - Fetch specific character
- `POST /characters` - Create new character
- `PUT /characters/:id` - Update character
- `DELETE /characters/:id` - Delete character

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is part of a frontend engineering assignment and is for demonstration purposes.

## 🎯 Assignment Requirements Met

✅ **JSON Server**: 1200+ unique character entries  
✅ **Selection Column**: Checkbox-based row selection  
✅ **Health Filter**: Dropdown with multiple selection  
✅ **Power Sorting**: Ascending/descending toggle  
✅ **Real-time Search**: Name and location filtering  
✅ **Submit Button**: Console logging of selected IDs  
✅ **Loading States**: Proper loading indicators  
✅ **Accessibility**: ARIA labels and keyboard support  
✅ **Performance**: Optimized for 1000+ rows  
✅ **Testing**: Comprehensive Jest test suite  
✅ **TypeScript**: Fully typed codebase  
✅ **Clean Code**: Modular, maintainable architecture

## 🔗 Live Demo

https://dope-security-fe-assignment-vibhor-sharma.netlify.app/

---
