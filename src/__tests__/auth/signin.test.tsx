import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignInPage from '@/app/auth/signin/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('SignIn Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockLocation.href = '';
    jest.clearAllMocks();
  });

  it('renders signin form correctly', () => {
    render(<SignInPage />);
    
    // Check for main elements
    expect(screen.getByText('DentalCloud')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your dental practice account.')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    
    // Check for signup link
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up here' })).toBeInTheDocument();
  });

  it('displays form validation for empty fields', async () => {
    render(<SignInPage />);
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitButton);
    
    // HTML5 validation should prevent submission
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    expect(emailInput.validity.valid).toBe(false);
    expect(passwordInput.validity.valid).toBe(false);
  });

  it('allows user to enter email and password', () => {
    render(<SignInPage />);
    
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('redirects to dashboard on successful form submission', async () => {
    render(<SignInPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Check that redirect happened
    await waitFor(() => {
      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  it('has proper form accessibility', () => {
    render(<SignInPage />);
    
    // Check for proper labels
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('displays feature highlights correctly', () => {
    render(<SignInPage />);
    
    // Check for feature highlights on the right panel
    expect(screen.getByText('Next-Gen Dental Practice Management')).toBeInTheDocument();
    expect(screen.getByText('Smart Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Digital Charting')).toBeInTheDocument();
    expect(screen.getByText('HIPAA Compliant')).toBeInTheDocument();
  });

  it('has proper styling classes for dark mode', () => {
    render(<SignInPage />);
    
    const container = screen.getByText('Welcome back').closest('div');
    expect(container).toHaveClass('text-white');
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveClass('bg-gray-700', 'text-white');
  });
});
