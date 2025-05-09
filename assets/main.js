import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';

export default function WildernessGuideApp() {
  const [mode, setMode] = useState('welcome');
  const [menuOpen, setMenuOpen] = useState(false);

  const [welcomeEmail, setWelcomeEmail] = useState('');
  const [welcomePassword, setWelcomePassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const resetForms = () => {
    setWelcomeEmail('');
    setWelcomePassword('');
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
  };

  return (
    <ImageBackground
      source={require('./image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/a1aa/image/4a6b3be3-866e-4d1e-00a4-44a1d878a4ad.jpg',
              }}
              style={styles.logo}
            />
            <Text style={styles.title}>Guide to Wilderness</Text>
          </View>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Side Menu */}
        {menuOpen && (
          <View style={styles.sideMenu}>
            {['Primary Guide', 'First Aid', 'Direction and Connection', 'Mountains', 'Journal'].map((item) => (
              <Text key={item} style={styles.menuItem}>
                {item}
              </Text>
            ))}
          </View>
        )}

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {mode === 'welcome' && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Welcome</Text>
              <TextInput
                placeholder="Enter your username or email"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={welcomeEmail}
                onChangeText={setWelcomeEmail}
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.input}
                value={welcomePassword}
                onChangeText={setWelcomePassword}
              />
              <TouchableOpacity style={styles.button} onPress={() => setMode('guide')}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => {
                  setMode('signup');
                  resetForms();
                }}
              >
                <Text style={styles.outlineButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'signup' && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Create Account</Text>
              <TextInput
                placeholder="Choose a username"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={signupUsername}
                onChangeText={setSignupUsername}
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={signupEmail}
                onChangeText={setSignupEmail}
              />
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.input}
                value={signupPassword}
                onChangeText={setSignupPassword}
              />
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.input}
                value={signupConfirmPassword}
                onChangeText={setSignupConfirmPassword}
              />
              <TouchableOpacity style={styles.button} onPress={() => setMode('success')}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setMode('welcome')}>
                <Text style={styles.outlineButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'success' && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Account Created!</Text>
              <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 40 }}>
                Your account has been successfully created.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => setMode('guide')}>
                <Text style={styles.buttonText}>Continue to Guide</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'guide' && (
            <View style={styles.guide}>
              <View style={styles.guideHeader}>
                <Text style={styles.guideTitle}>Welcome to the Guide</Text>
                <TouchableOpacity style={styles.button} onPress={() => setMode('welcome')}>
                  <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.guideText}>
                Explore the wilderness with confidence. Use the navigation menu to access different sections.
              </Text>

              <View style={styles.cardGrid}>
                {[
                  {
                    title: 'Primary Guide',
                    description: 'Essential tips and instructions for wilderness survival and safety.',
                    image: 'https://storage.googleapis.com/a1aa/image/72df2fce-8d2e-4f02-aabd-888e9b74a72c.jpg',
                  },
                  {
                    title: 'First Aid',
                    description: 'How to handle injuries and emergencies in the wild.',
                    image: 'https://storage.googleapis.com/a1aa/image/e1642841-4d21-4a14-36c1-04da933b04c2.jpg',
                  },
                  {
                    title: 'Direction and Connection',
                    description: 'Navigational tools and communication methods.',
                    image: 'https://storage.googleapis.com/a1aa/image/0b83bebd-eb2d-44c3-bbe7-dd7991b1c4ec.jpg',
                  },
                  {
                    title: 'Mountains',
                    description: 'Information about mountain terrain, weather, and safety tips.',
                    image: 'https://storage.googleapis.com/a1aa/image/331b42f9-7ae0-46c6-b468-40c195a73d2d.jpg',
                  },
                  {
                    title: 'Journal',
                    description: 'Keep track of your adventures and experiences.',
                    image: 'https://storage.googleapis.com/a1aa/image/fb53e04b-6b50-491c-6449-cc6c52760c12.jpg',
                  },
                ].map((card) => (
                  <View key={card.title} style={styles.card}>
                    <Image source={{ uri: card.image }} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>{card.description}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.button} onPress={() => setMode('welcome')}>
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { flex: 1,},
  header: {
    backgroundColor: '#1a2e0f',
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },
  title: { color: '#fff', fontSize: 20, fontFamily: 'LuckiestGuy-Regular', marginLeft: 12 },
  menuIcon: { fontSize: 28, color: '#d98a3a' },
  sideMenu: {
    position: 'absolute',
    top: 64,
    right: 0,
    width: 200,
    backgroundColor: '#1a2e0f',
    padding: 16,
    zIndex: 20,
  },
  menuItem: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  content: { padding: 16 },
  form: { marginTop: 20 },
  formTitle: {
    fontSize: 28,
    color: '#d98a3a',
    fontFamily: 'LuckiestGuy-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#666',
    borderWidth: 1,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#d98a3a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#000', fontWeight: 'bold' },
  outlineButton: {
    borderColor: '#d98a3a',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  outlineButtonText: { color: '#d98a3a', fontWeight: 'bold' },
  guide: { marginTop: 20 },
  guideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  guideTitle: {
    fontSize: 28,
    color: '#d98a3a',
    fontFamily: 'LuckiestGuy-Regular',
  },
  guideText: { color: '#fff', marginVertical: 12, fontSize: 16 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '48%',
  },
  cardImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
  cardTitle: { color: '#d98a3a', fontWeight: 'bold', fontSize: 16 },
  cardDescription: { color: '#fff', fontSize: 14 },
});
