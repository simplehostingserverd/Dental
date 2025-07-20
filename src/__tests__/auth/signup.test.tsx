import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignUpPage from '@/app/auth/signup/page';

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

describe('SignUp Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockLocation.href = '';
    jest.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    render(<SignUpPage />);
    
    // Check for main elements
    expect(screen.getByText('DentalCloud')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Start your free trial of DentalCloud today.')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Practice Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    
    // Check for signin link
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in here' })).toBeInTheDocument();
  });

  it('displays form validation for empty fields', async () => {
    render(<SignUpPage />);
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    fireEvent.click(submitButton);
    
    // HTML5 validation should prevent submission
    const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement;
    const lastNameInput = screen.getByLabelText('Last Name') as HTMLInputElement;
    const practiceNameInput = screen.getByLabelText('Practice Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
    
    expect(firstNameInput.validity.valid).toBe(false);
    expect(lastNameInput.validity.valid).toBe(false);
    expect(practiceNameInput.validity.valid).toBe(false);
    expect(emailInput.validity.valid).toBe(false);
    expect(passwordInput.validity.valid).toBe(false);
    expect(confirmPasswordInput.validity.valid).toBe(false);
  });

  it('allows user to enter all form data', () => {
    render(<SignUpPage />);
    
    const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement;
    const lastNameInput = screen.getByLabelText('Last Name') as HTMLInputElement;
    const practiceNameInput = screen.getByLabelText('Practice Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
    
    // Fill in all fields
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(practiceNameInput, { target: { value: 'Smile Dental Clinic' } });
    fireEvent.change(emailInput, { target: { value: 'john@smiledental.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Verify values
    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(practiceNameInput.value).toBe('Smile Dental Clinic');
    expect(emailInput.value).toBe('john@smiledental.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  it('redirects to dashboard on successful form submission', async () => {
    render(<SignUpPage />);
    
    // Get all form inputs
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const practiceNameInput = screen.getByLabelText('Practice Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    // Fill in the form
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(practiceNameInput, { target: { value: 'Smile Dental Clinic' } });
    fireEvent.change(emailInput, { target: { value: 'john@smiledental.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Check that redirect happened
    await waitFor(() => {
      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  it('has proper form accessibility', () => {
    render(<SignUpPage />);
    
    // Check for proper input types and attributes
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Check required attributes
    expect(screen.getByLabelText('First Name')).toHaveAttribute('required');
    expect(screen.getByLabelText('Last Name')).toHaveAttribute('required');
    expect(screen.getByLabelText('Practice Name')).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });

  it('displays feature highlights correctly', () => {
    render(<SignUpPage />);
    
    // Check for feature highlights on the right panel
    expect(screen.getByText('Join Thousands of Dental Practices')).toBeInTheDocument();
    expect(screen.getByText('Smart Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Digital Charting')).toBeInTheDocument();
    expect(screen.getByText('HIPAA Compliant')).toBeInTheDocument();
  });

  it('has proper styling classes for dark mode', () => {
    render(<SignUpPage />);
    
    const container = screen.getByText('Create your account').closest('div');
    expect(container).toHaveClass('text-white');
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveClass('bg-gray-700', 'text-white');
  });

  it('has proper placeholder text', () => {
    render(<SignUpPage />);
    
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Smile Dental Clinic')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@smiledental.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });
});
