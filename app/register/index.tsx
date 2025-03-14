import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';

interface RegisterForm {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterScreen = () => {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterForm) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Register attempt with:', data);
                    resolve({ success: true });
                }, 1000);
            });
        },
        onSuccess: () => {
            router.push('/(tabs)');
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        }
    });

    const onSubmit = (data: RegisterForm) => {
        registerMutation.mutate(data);
    };

    const handleGoogleSignIn = () => {
        console.log('Google sign in pressed');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.welcomeText}>Create Account 🚀</Text>
                    <Text style={styles.subtitleText}>
                        Join us on your journey to better health
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <InputField
                        label="Full Name"
                        control={control}
                        name="fullName"
                        placeholder="Enter your full name"
                        rules={{
                            required: 'Full name is required',
                            minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters'
                            }
                        }}
                        error={errors.fullName?.message}
                    />

                    <InputField
                        label="Email"
                        control={control}
                        name="email"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        }}
                        error={errors.email?.message}
                    />

                    <InputField
                        label="Password"
                        control={control}
                        name="password"
                        placeholder="Create a password"
                        secureTextEntry
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        }}
                        error={errors.password?.message}
                    />

                    <InputField
                        label="Confirm Password"
                        control={control}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        secureTextEntry
                        rules={{
                            required: 'Please confirm your password',
                            validate: (value: string, formValues: RegisterForm) =>
                                value === formValues.password || 'Passwords do not match'
                        }}
                        error={errors.confirmPassword?.message}
                    />

                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            registerMutation.isPending && styles.registerButtonDisabled
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignIn}
                    >
                        <Image
                            source={require('../../assets/images/google.png')}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleButtonText}>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignIn}
                    >
                        <Image
                            source={require('../../assets/images/facebook-logo.png')}
                            style={styles.facebookIcon}
                        />
                        <Text style={styles.googleButtonText}>
                            Continue with Facebook
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('login')}
                        >
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

interface InputFieldProps {
    label: string;
    error?: string;
    control: any;
    name: keyof RegisterForm;
    rules?: any;
    [key: string]: any;
}

const InputField = ({ label, error, control, name, rules, ...props }: InputFieldProps) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#999"
                    {...props}
                />
            )}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 2,
    },
    registerButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonDisabled: {
        backgroundColor: '#B3D7FF',
        shadowOpacity: 0,
        elevation: 0,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E9ECEF',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#666666',
        fontSize: 13,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    facebookIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#1A1A1A',
        fontSize: 15,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#666666',
        fontSize: 14,
    },
    loginLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default RegisterScreen;
