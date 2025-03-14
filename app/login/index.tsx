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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { LoginForm, LoginInputFieldProps } from '@/types/types';
import { useForm, Controller } from 'react-hook-form';


const LoginScreen = () => {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginForm) => {
            // TODO: Implement actual API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Login attempt with:', data);
                    resolve({ success: true });
                }, 1000);
            });
        },
        onSuccess: () => {
            router.push('/(tabs)');
        },
        onError: (error) => {
            console.error('Login failed:', error);
        }
    });

    const onSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
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
                    <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
                    <Text style={styles.subtitleText}>
                        Continue your journey to better health
                    </Text>
                </View>

                <View style={styles.formContainer}>
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
                        placeholder="Enter your password"
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

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => console.log('Forgot password')}
                    >
                        <Text style={styles.forgotPasswordText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            loginMutation.isPending && styles.loginButtonDisabled
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loginMutation.isPending}
                    >
                        <Text style={styles.loginButtonText}>
                            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('register')}
                        >
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const InputField = ({ label, error, control, name, rules, ...props }: LoginInputFieldProps) => (
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
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 24,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 140,
        height: 140,
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
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
        marginTop: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        padding: 4,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonDisabled: {
        backgroundColor: '#B3D7FF',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#666666',
        fontSize: 15,
    },
    signupLink: {
        color: '#007AFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default LoginScreen;
