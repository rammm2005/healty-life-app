export type LoginForm = {
    email: string;
    password: string;
}

export type LoginInputFieldProps = {
    label: string;
    error?: string;
    control: any;
    name: keyof LoginForm;
    [key: string]: any;
}


export type RegisterForm = {
    fullName: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
}

export type RegisterInputFieldProps = {
    label: string;
    error?: string;
    control: any;
}