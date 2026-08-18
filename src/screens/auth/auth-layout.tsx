import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiBaseUrl } from '../../api/config';
import {
  border,
  color,
  fontFamily,
  fontSize,
  letterSpacing,
  space,
} from '../../theme';

type AuthLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ children, footer }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, space[3]) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>SEMUMREAl</Text>
        <Text style={styles.subtitle}>SEU DINHEIRO SEM FIRULA</Text>
        {children}
        {footer}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type AuthFieldProps = {
  label: string;
} & Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'secureTextEntry'
  | 'autoComplete'
  | 'autoCapitalize'
  | 'keyboardType'
  | 'editable'
  | 'textContentType'
>;

export function AuthField({
  label,
  autoCapitalize = 'none',
  ...inputProps
}: AuthFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        placeholderTextColor={color.muted}
        style={styles.input}
        accessibilityLabel={label}
        {...inputProps}
      />
    </View>
  );
}

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthButton({ label, onPress, disabled }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export function AuthLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: color.paper,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space[3],
    paddingTop: space[2],
  },
  title: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.md,
    color: color.ink,
    letterSpacing: letterSpacing.wide,
    marginBottom: space[1],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.muted,
    letterSpacing: letterSpacing.tight,
    marginBottom: space[4],
    textAlign: 'center',
  },
  field: {
    marginBottom: space[2],
  },
  label: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.ink,
    letterSpacing: letterSpacing.tight,
    marginBottom: space[1],
  },
  input: {
    borderWidth: border.width,
    borderColor: color.line,
    backgroundColor: color.paper,
    color: color.ink,
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.sm,
    letterSpacing: letterSpacing.tight,
    minHeight: 48,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
  },
  button: {
    backgroundColor: color.ink,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space[1],
    marginBottom: space[3],
  },
  buttonPressed: {
    backgroundColor: color.panel,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.sm,
    color: color.paper,
    letterSpacing: letterSpacing.wide,
  },
  link: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.muted,
    letterSpacing: letterSpacing.tight,
    textAlign: 'center',
  },
  error: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.ink,
    letterSpacing: letterSpacing.tight,
    marginBottom: space[2],
    lineHeight: 16,
  },
  debug: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.muted,
    letterSpacing: letterSpacing.tight,
    textAlign: 'center',
    marginTop: space[3],
    lineHeight: 16,
  },
});
