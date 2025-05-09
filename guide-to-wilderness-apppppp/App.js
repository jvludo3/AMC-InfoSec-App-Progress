import React, { useState, useEffect } from 'react';
import {SafeAreaView,
  View,
  Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground, Image, FlatList,Platform,StatusBar,Modal,TouchableWithoutFeedback,Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- THEME COLORS ---
const THEME_COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  brandOrange: '#D4A373',
  headerBackground: '#22361F',
  stepNavCardBackground: 'rgba(34, 54, 31, 0.9)',
  inputBackground: '#1A1A1A',
  inputPlaceholder: '#757575',
  buttonTextDark: '#000000',
  hamburgerColor: '#D4A373',
  disabledButtonBackground: '#505050',
  cardTextContainerBackground: 'transparent',
  menuItemBorder: '#3A5A32',
  checkboxBorder: '#FFFFFF',
  checkboxCheckedBackground: '#D4A373',
  checkboxCheckmarkColor: '#000000',
};

// --- ASSET PATHS ---
const appIcon = require('./assets/logo.png');
const forestBackgroundAsset = require('./assets/image.png'); // Placeholder for step navigator background

// --- CUSTOM CHECKBOX COMPONENT ---
const CustomCheckBox = ({ value, onValueChange, label }) => (
  <TouchableOpacity style={customCheckboxStyles.container} onPress={() => onValueChange && onValueChange(!value)} activeOpacity={0.7}>
    <View style={[customCheckboxStyles.box, value && customCheckboxStyles.boxChecked]}>
      {value && <Text style={customCheckboxStyles.checkmark}>✓</Text>}
    </View>
    {label && <Text style={customCheckboxStyles.label}>{label}</Text>}
  </TouchableOpacity>
);
const customCheckboxStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 15, },
  box: { width: 22, height: 22, borderWidth: 2, borderColor: THEME_COLORS.checkboxBorder, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderRadius: 4, backgroundColor: 'transparent', },
  boxChecked: { backgroundColor: THEME_COLORS.checkboxCheckedBackground, borderColor: THEME_COLORS.checkboxCheckedBackground, },
  checkmark: { color: THEME_COLORS.checkboxCheckmarkColor, fontSize: 14, fontWeight: 'bold', },
  label: { color: THEME_COLORS.text, fontWeight: 'bold', fontSize: 16, },
});

// --- DATA ---
const categories = [
  { id: '1', title: 'PRIMARY GUIDE', description: 'Essential tips and instructions for wilderness survival and safety.', image: require('./assets/primaryguide.jpg'), },
  { id: '2', title: 'FIRST AID', description: 'How to handle injuries and emergencies in the wild.', image: require('./assets/FIRSTAID.jpg'), },
  { id: '3', title: 'DIRECTION & CONNECTION', description: 'Navigational tools and communication methods.', image: require('./assets/DIRECTIONS.jpg'), },
  { id: '4', title: 'MOUNTAINS', description: 'Information about mountain terrain, weather, and safety tips.', image: require('./assets/mountains.jpg'), },
  { id: '5', title: 'JOURNAL', description: 'Keep track of your adventures and notes.', image: require('./assets/journals.jpg'), },
];
const fireBatteryStepsData = [
  { id: '1', title: 'Gather your materials:\nCollect dry leaves, twigs, and small kindling for your campfire.', image: require('./assets/creatingfire/step1fire.png') },
  { id: '2', title: 'Prepare the steel wool:\nTake a small piece of fine steel wool.', image: require('./assets/creatingfire/step2fire.png') },
  { id: '3', title: 'Set up the fire:\nArrange your dry kindling in a pile, leaving space for air to flow around it.', image: require('./assets/creatingfire/step3fire.png') },
  { id: '4', title: 'Rub the steel wool on the battery:\nPress the steel wool against both terminals of the 9V battery. It will start sparking and heating up.', image: require('./assets/creatingfire/step4fire.png') },
  { id: '5', title: 'Ignite the fire:\nBlow gently on the glowing steel wool to help it catch fire. The sparks will ignite the kindling.', image: require('./assets/creatingfire/step5fire.png') },
  { id: '6', title: 'Build the fire:\nGradually add more twigs and wood as the fire grows.', image: require('./assets/creatingfire/step6fire.png') },
];
const buildingShelterStepsData = [
  { id: 'shelter1', title: 'Find a Suitable Location:\nLook for a flat, dry area, protected from wind and potential hazards like falling branches.', image: require('./assets/primaryguide/shelter.png') },
  { id: 'shelter2', title: 'Gather Materials:\nCollect sturdy branches for the frame, smaller branches for support, and plenty of leaves or pine needles for insulation.', image: require('./assets/creatingfire/step1fire.png') },
  { id: 'shelter3', title: 'Construct the Frame:\nCreate an A-frame or lean-to structure using the larger branches. Ensure it is stable and secure.', image: require('./assets/primaryguide/shelter.png') },
  { id: 'shelter4', title: 'Add Support and Walls:\nWeave smaller branches through the main frame to create a lattice for the walls and roof.', image: require('./assets/creatingfire/step3fire.png') },
  { id: 'shelter5', title: 'Insulate and Cover:\nLayer the outside of the shelter thickly with leaves, pine needles, or moss. Start from the bottom up for waterproofing.', image: require('./assets/primaryguide/shelter.png') },
  { id: 'shelter6', title: 'Create Bedding:\nInside, make a thick bed of dry leaves or pine needles for insulation from the cold ground.', image: require('./assets/journals.jpg') },
];
const purifyWaterStepsData = [
  { id: 'water1', title: 'Find a Water Source:\nLocate the clearest possible water, preferably flowing. Avoid stagnant water if possible.', image: require('./assets/primaryguide/water.png') },
  { id: 'water2', title: 'Collect Water & Settle:\nUse a clean container. If murky, let sediment settle for several hours, then carefully pour off the clearer water.', image: require('./assets/creatingfire/step1fire.png') },
  { id: 'water3', title: 'Boiling Method (Best):\nBring water to a rolling boil for at least 1 minute (3 minutes at high altitudes) to kill most pathogens.', image: require('./assets/primaryguide/fire.png') },
  { id: 'water4', title: 'Solar Disinfection (SODIS):\nIf no fire, fill a clear plastic bottle, cap it, and lay it horizontally in strong, direct sunlight for at least 6 hours (or 2 days if cloudy).', image: require('./assets/primaryguide/water.png') },
  { id: 'water5', title: 'Improvised Filter (Pre-step for clarity):\nLayer cloth, charcoal (from cooled fire), sand, and gravel in a container with a small hole at the bottom. Pour water through.', image: require('./assets/DIRECTIONS.jpg') },
  { id: 'water6', title: 'Cool and Store:\nAfter purification, let the water cool. Store in a clean, covered container to prevent recontamination.', image: require('./assets/primaryguide/water.png') },
];

// --- NEW FIRST AID STEP DATA ---
const stopBleedingStepsData = [
    { id: 'bleed1', title: 'Ensure Safety:\nAssess the scene for any dangers to yourself or the injured person.', image: require('./assets/firstaid/bandAid.png') },
    { id: 'bleed2', title: 'Apply Direct Pressure:\nUse a clean cloth or dressing (or your hand if nothing else is available) and apply firm, direct pressure to the wound.', image: require('./assets/firstaid/bandAid.png') },
    { id: 'bleed3', title: 'Elevate the Wound:\nIf possible, raise the injured limb above the level of the heart to help reduce blood flow.', image: require('./assets/firstaid/bandAid.png') },
    { id: 'bleed4', title: 'Maintain Pressure:\nContinue applying pressure. If blood soaks through the first dressing, add another on top. Do not remove the original dressing.', image: require('./assets/firstaid/wound.png') },
    { id: 'bleed5', title: 'Pressure Points (If Needed):\nIf direct pressure and elevation are not enough, apply pressure to a major artery supplying blood to the injured area.', image: require('./assets/firstaid/bandAid.png') },
    { id: 'bleed6', title: 'Seek Medical Help:\nEven if bleeding stops, severe wounds require professional medical attention.', image: require('./assets/FIRSTAID.jpg') },
];
const treatMinorBurnStepsData = [
    { id: 'burn1', title: 'Cool the Burn:\nImmediately hold the burned area under cool (not ice-cold) running water for 10-15 minutes or until the pain subsides.', image: require('./assets/firstaid/wound.png') },
    { id: 'burn2', title: 'Remove Jewelry/Tight Items:\nGently remove rings or other tight items from the burned area before it swells.', image: require('./assets/firstaid/wound.png') },
    { id: 'burn3', title: 'Do Not Break Blisters:\nIf blisters form, leave them intact. Broken blisters are more prone to infection.', image: require('./assets/firstaid/wound.png') },
    { id: 'burn4', title: 'Apply Aloe Vera or Moisturizer:\nOnce cooled, apply a thin layer of aloe vera gel or a moisturizing lotion to help soothe the skin.', image: require('./assets/firstaid/wound.png') },
    { id: 'burn5', title: 'Cover Loosely (Optional):\nIf needed, cover the burn with a sterile non-stick dressing. Do not use fluffy cotton that can stick to the burn.', image: require('./assets/firstaid/bandAid.png') },
    { id: 'burn6', title: 'Pain Relief:\nTake an over-the-counter pain reliever like ibuprofen or acetaminophen if needed.', image: require('./assets/FIRSTAID.jpg') },
];
const diySlingStepsData = [
    { id: 'sling1', title: 'Find Material:\nUse a triangular bandage, a large piece of cloth (like a t-shirt or scarf), or even a sturdy belt.', image: require('./assets/firstaid/sprained.png') },
    { id: 'sling2', title: 'Position Arm:\nGently bend the injured arm across the chest, with the hand slightly higher than the elbow if possible.', image: require('./assets/firstaid/sprained.png') },
    { id: 'sling3', title: 'Place Bandage:\nIf using a triangular bandage, place the point of the triangle under the elbow of the injured arm. Bring one end over the shoulder on the uninjured side.', image: require('./assets/firstaid/sprained.png') },
    { id: 'sling4', title: 'Secure the Sling:\nBring the other end of the bandage over the shoulder on the injured side. Tie the two ends securely at the side of the neck (not directly on the spine).', image: require('./assets/firstaid/sprained.png') },
    { id: 'sling5', title: 'Support the Elbow:\nFold the point of the triangle at the elbow forward and pin it to the front of the sling, or tuck it in.', image: require('./assets/firstaid/sprained.png') },
    { id: 'sling6', title: 'Check Circulation:\nEnsure the sling is not too tight by checking for numbness, tingling, or color changes in the fingers.', image: require('./assets/FIRSTAID.jpg') },
];

// --- NEW DIRECTION & CONNECTION STEP DATA ---
const findNorthWatchStepsData = [
    { id: 'watch1', title: 'Analog Watch Needed:\nThis method requires an analog watch with hour and minute hands (not a digital watch).', image: require('./assets/directions/compass.png') },
    { id: 'watch2', title: 'Northern Hemisphere:\nPoint the hour hand of your watch directly at the sun.', image: require('./assets/directions/sun.png') },
    { id: 'watch3', title: 'Bisect the Angle:\nImagine a line halfway between the hour hand and the 12 o\'clock mark on your watch. This halfway line points South.', image: require('./assets/directions/compass.png') },
    { id: 'watch4', title: 'Find North:\nNorth will be directly opposite this South line (180 degrees away).', image: require('./assets/directions/compass.png') },
    { id: 'watch5', title: 'Southern Hemisphere:\nPoint the 12 o\'clock mark on your watch at the sun. The line halfway between the 12 and the hour hand points North.', image: require('./assets/directions/sun.png') },
    { id: 'watch6', title: 'Daylight Saving Time:\nIf Daylight Saving Time is in effect, use the 1 o\'clock mark instead of the 12 o\'clock mark in your calculations.', image: require('./assets/DIRECTIONS.jpg') },
];
const makeSOSSignalStepsData = [
    { id: 'sos1', title: 'Universal Distress Signal:\nSOS (... --- ...) is internationally recognized. Three short signals, three long, three short.', image: require('./assets/directions/sos.png') },
    { id: 'sos2', title: 'Visual Signals (Day):\nUse a mirror to flash sunlight towards potential rescuers. Create large ground signals (e.g., "SOS" or "X" with rocks/logs). Use smoke from a fire (add green vegetation for more smoke).', image: require('./assets/directions/sos.png') },
    { id: 'sos3', title: 'Auditory Signals:\nUse a whistle (three blasts). Shout in sets of three. Bang rocks together or hit a hollow log.', image: require('./assets/directions/sos.png') },
    { id: 'sos4', title: 'Light Signals (Night):\nUse a flashlight or headlamp to flash SOS. If possible, build three fires in a triangle or a straight line, about 100 feet apart.', image: require('./assets/directions/sos.png') },
    { id: 'sos5', title: 'Contrast and Visibility:\nMake your signals contrast with the surroundings. Choose an open area where signals are easily seen from the air or a distance.', image: require('./assets/directions/sos.png') },
    { id: 'sos6', title: 'Persistence:\nContinue signaling regularly until help arrives or you are sure you\'ve been spotted.', image: require('./assets/DIRECTIONS.jpg') },
];
const sunDirectionStepsData = [
    { id: 'sun1', title: 'Basic Sun Movement:\nThe sun generally rises in the East and sets in the West.', image: require('./assets/directions/sun.png') },
    { id: 'sun2', title: 'Shadow Stick Method:\nPlace a stick upright in the ground. Mark the tip of its shadow. Wait 15-30 minutes and mark the new shadow tip.', image: require('./assets/directions/sun.png') },
    { id: 'sun3', title: 'East-West Line:\nA line drawn between the first mark (West) and the second mark (East) gives you an approximate East-West line.', image: require('./assets/directions/compass.png') },
    { id: 'sun4', title: 'Finding North/South:\nStand with the first mark to your left and the second to your right. You are now facing approximately North (in the Northern Hemisphere). South is behind you.', image: require('./assets/directions/compass.png') },
    { id: 'sun5', title: 'Sun at Midday:\nIn the Northern Hemisphere, the sun is due South at its highest point (local noon). In the Southern Hemisphere, it\'s due North.', image: require('./assets/directions/sun.png') },
    { id: 'sun6', title: 'Accuracy Considerations:\nThis method is less accurate near the equator or during midday. Use in conjunction with other methods if possible.', image: require('./assets/DIRECTIONS.jpg') },
];


const primaryGuideSubCategories = [
  { id: '1', title: 'CREATING FIRE USING BATTERY', description: 'Learn to make fire with common items.', image: require('./assets/primaryguide/fire.png') },
  { id: '2', title: 'BUILDING SHELTER', description: 'Techniques for constructing emergency shelters.', image: require('./assets/primaryguide/shelter.png') },
  { id: '3', title: 'PURIFY WATER WITHOUT FILTER', description: 'Methods to make water safe to drink.', image: require('./assets/primaryguide/water.png') },
];
const firstAidSubCategories = [
  { id: '1', title: 'STOP BLEEDING FAST', description: 'Critical steps to control severe bleeding.', image: require('./assets/firstaid/bandAid.png') },
  { id: '2', title: 'TREAT A MINOR BURN', description: 'First aid for common burn injuries.', image: require('./assets/firstaid/wound.png') },
  { id: '3', title: 'DIY Sling for a Sprained legs', description: 'Improvise a sling for leg injuries.', image: require('./assets/firstaid/sprained.png') },
];
const directionSubCategories = [
  { id: '1', title: 'Find North Using a Watch', description: 'Use an analog watch for navigation.', image: require('./assets/directions/compass.png') },
  { id: '2', title: 'Make an SOS Signal', description: 'Effective ways to signal for help.', image: require('./assets/directions/sos.png') },
  { id: '3', title: 'Using the Sun to Find Direction', description: 'Navigate using the suns position.', image: require('./assets/directions/sun.png') },
];

// --- HAMBURGER ICON & APP HEADER ---
const HamburgerIcon = ({ onPress }) => ( <TouchableOpacity onPress={onPress} style={styles.hamburgerButton}> <View style={styles.hamburgerLine} /><View style={styles.hamburgerLine} /><View style={styles.hamburgerLine} /> </TouchableOpacity> );
const AppHeader = ({ showHamburger = true, onMenuPress }) => ( <View style={styles.header}> <View style={styles.headerLeftContent}><Image source={appIcon} style={styles.headerIconGeneral} /><Text style={styles.headerTextGeneral}>Guide to Wilderness</Text></View> {showHamburger && <HamburgerIcon onPress={onMenuPress} />} </View> );

// --- SIDE MENU ---
const menuItems = [ { id: 'menu1', title: 'Primary Guide', targetScreen: 'primaryGuide' }, { id: 'menu2', title: 'First Aid', targetScreen: 'firstAid' }, { id: 'menu3', title: 'Direction and Connection', targetScreen: 'directionConnection' }, { id: 'menu4', title: 'Mountains', targetScreen: 'mountains' }, { id: 'menu5', title: 'Journal', targetScreen: 'journal' }, ];
const SideMenu = ({ isVisible, onClose, onNavigate }) => { const menuWidth = Dimensions.get('window').width * 0.75; return ( <Modal transparent={true} visible={isVisible} onRequestClose={onClose} animationType="slide"> <TouchableWithoutFeedback onPress={onClose}> <View style={styles.menuOverlay}> <TouchableWithoutFeedback> <View style={[styles.menuContainer, { width: menuWidth }]}> <SafeAreaView style={{flex: 1}}> <FlatList data={menuItems} keyExtractor={(item) => item.id} renderItem={({ item }) => ( <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate(item)}> <Text style={styles.menuItemText}>{item.title}</Text> </TouchableOpacity> )} ItemSeparatorComponent={() => <View style={styles.menuItemSeparator} />} /> </SafeAreaView> </View> </TouchableWithoutFeedback> </View> </TouchableWithoutFeedback> </Modal> ); };

// --- STEPNAVIGATOR-SPECIFIC HEADER ---
const StepNavigatorNewHeader = ({ title }) => ( <View style={styles.stepNavNewHeaderContainer}> <Image source={appIcon} style={styles.stepNavNewHeaderIcon} /> <Text style={styles.stepNavNewHeaderTitle}>{title.toUpperCase()}</Text> </View> );

// --- Placeholder for Icons ---
const IconPlaceholder = ({ char, size = 24, color = THEME_COLORS.brandOrange, style }) => ( <Text style={[{ fontSize: size, color: color, fontWeight: 'bold' }, style]}>{char}</Text> );

// --- STEP NAVIGATOR (New Design) ---
const StepNavigatorNew = ({ steps, title, onBack, setScreen, previousScreenForStepNav }) => { const [index, setIndex] = useState(0); if (!steps || steps.length === 0) { return ( <SafeAreaView style={styles.centeredError}><Text style={styles.errorText}>Error: No steps provided.</Text><TouchableOpacity onPress={onBack} style={styles.errorButton}><Text style={styles.buttonText}>Go Back</Text></TouchableOpacity></SafeAreaView> ); } const currentStep = steps[index]; if (!currentStep) { return ( <SafeAreaView style={styles.centeredError}><Text style={styles.errorText}>Error: Invalid step.</Text><TouchableOpacity onPress={onBack} style={styles.errorButton}><Text style={styles.buttonText}>Go Back</Text></TouchableOpacity></SafeAreaView> ); } const goToPreviousStep = () => { if (index > 0) setIndex(index - 1); }; const goToNextStep = () => { if (index < steps.length - 1) setIndex(index + 1); }; const handleHomeNavigation = () => { if (setScreen) setScreen('mainMenu'); else onBack(); }; const cardImageSource = currentStep.image; return ( <ImageBackground source={forestBackgroundAsset} style={styles.stepNavNewBackground} resizeMode="cover"> <SafeAreaView style={styles.stepNavNewOverlay}> <StepNavigatorNewHeader title={title} /> <View style={styles.stepNavNewContentArea}> {steps.length > 1 && ( <TouchableOpacity style={[styles.stepNavNewSideArrow, index === 0 && styles.disabledOpacity]} onPress={goToPreviousStep} disabled={index === 0}> <IconPlaceholder char="‹" size={36} color={THEME_COLORS.text} /> </TouchableOpacity> )} <View style={styles.stepNavNewCard}> {cardImageSource ? ( <Image source={cardImageSource} style={styles.stepNavNewCardIcon} resizeMode="contain" /> ) : ( <View style={styles.stepNavNewCardIconPlaceholder}><Text style={{color: THEME_COLORS.textSecondary}}>No Image</Text></View> )} <Text style={styles.stepNavNewCardStepNumber}>STEP {index + 1}</Text> <Text style={styles.stepNavNewCardDescription}>{currentStep.title}</Text> </View> {steps.length > 1 && ( <TouchableOpacity style={[styles.stepNavNewSideArrow, index === steps.length - 1 && styles.disabledOpacity]} onPress={goToNextStep} disabled={index === steps.length - 1}> <IconPlaceholder char="›" size={36} color={THEME_COLORS.text} /> </TouchableOpacity> )} </View> <View style={styles.stepNavNewBottomBar}> <TouchableOpacity style={styles.stepNavNewBottomButton} onPress={onBack}> <IconPlaceholder char="ᐊ" size={22} /> </TouchableOpacity> <TouchableOpacity style={[styles.stepNavNewBottomButton, styles.stepNavNewBottomButtonHome]} onPress={handleHomeNavigation}> <IconPlaceholder char="⌂" size={28} color={THEME_COLORS.headerBackground} /> </TouchableOpacity> <TouchableOpacity style={styles.stepNavNewBottomButton} onPress={() => { if (setScreen && previousScreenForStepNav) { setScreen(previousScreenForStepNav); } else { onBack(); } }}> <IconPlaceholder char="≡" size={22}/> </TouchableOpacity> </View> </SafeAreaView> </ImageBackground> ); };


export default function App() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [previousScreen, setPreviousScreen] = useState('mainMenu'); // General previous screen
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => { const loadStoredCredentials = async () => { try { const storedEmail = await AsyncStorage.getItem('email'); const storedPassword = await AsyncStorage.getItem('password'); if (storedEmail && storedPassword) { setEmail(storedEmail); setPassword(storedPassword); setRememberMe(true); } } catch (e) { console.error("Failed to load credentials", e); } }; loadStoredCredentials(); }, []);
  const handleSignIn = async () => { if (!email || !password) { alert('Please enter both email and password.'); return; } try { if (rememberMe) { await AsyncStorage.setItem('email', email); await AsyncStorage.setItem('password', password); } else { await AsyncStorage.removeItem('email'); await AsyncStorage.removeItem('password'); } } catch (e) { console.error("Failed to save credentials", e); } setScreen('mainMenu'); };
  const handleSignUp = () => { if (!username || !email || !password || !confirmPassword) { alert('Please fill out all fields.'); return; } if (password !== confirmPassword) { alert('Passwords do not match.'); return; } if (!email.includes('@') || !email.includes('.')) { alert('Please enter a valid email address.'); return; } if (password.length < 6) { alert('Password must be at least 6 characters long.'); return; } setScreen('signupSuccess'); };
  const handleCategoryClick = (categoryItem, currentScreenName) => { setPreviousScreen(currentScreenName); switch (categoryItem.title) { case 'PRIMARY GUIDE': setScreen('primaryGuide'); break; case 'FIRST AID': setScreen('firstAid'); break; case 'DIRECTION & CONNECTION': setScreen('directionConnection'); break; case 'MOUNTAINS': case 'JOURNAL': setSelectedTitle(categoryItem.title); setSelectedSteps([{ id: categoryItem.id, title: categoryItem.description, image: categoryItem.image }]); setScreen('stepNavigator'); break; default: alert(`${categoryItem.title} is not yet implemented.`); } };
  const renderCategory = ({ item }) => ( <TouchableOpacity style={styles.card} onPress={() => handleCategoryClick(item, 'mainMenu')}> <Image source={item.image} style={styles.cardImage} /> <View style={styles.cardTextContainer}> <Text style={styles.cardTitle}>{item.title}</Text> {item.description && <Text style={styles.cardDescription}>{item.description}</Text>} </View> </TouchableOpacity> );

  const renderSubCategory = ({ item, parentScreen }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
        setPreviousScreen(parentScreen); // This specific parent (e.g., 'firstAid') for StepNav back
        setSelectedTitle(item.title);

        if (item.title === 'CREATING FIRE USING BATTERY') { setSelectedSteps(fireBatteryStepsData); }
        else if (item.title === 'BUILDING SHELTER') { setSelectedSteps(buildingShelterStepsData); }
        else if (item.title === 'PURIFY WATER WITHOUT FILTER') { setSelectedSteps(purifyWaterStepsData); }
        else if (item.title === 'STOP BLEEDING FAST') { setSelectedSteps(stopBleedingStepsData); }
        else if (item.title === 'TREAT A MINOR BURN') { setSelectedSteps(treatMinorBurnStepsData); }
        else if (item.title === 'DIY Sling for a Sprained legs') { setSelectedSteps(diySlingStepsData); }
        else if (item.title === 'Find North Using a Watch') { setSelectedSteps(findNorthWatchStepsData); }
        else if (item.title === 'Make an SOS Signal') { setSelectedSteps(makeSOSSignalStepsData); }
        else if (item.title === 'Using the Sun to Find Direction') { setSelectedSteps(sunDirectionStepsData); }
        else { setSelectedSteps([ { id: item.id, title: item.description, image: item.image } ]); }
        setScreen('stepNavigator');
      }}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}
      </View>
    </TouchableOpacity>
  );

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  const handleMenuNavigation = (menuItem) => { setIsMenuVisible(false); setPreviousScreen(screen); switch (menuItem.targetScreen) { case 'primaryGuide': setScreen('primaryGuide'); break; case 'firstAid': setScreen('firstAid'); break; case 'directionConnection': setScreen('directionConnection'); break; case 'mountains': case 'journal': const categoryData = categories.find(cat => cat.title.toLowerCase().includes(menuItem.title.toLowerCase().split(' ')[0])); if (categoryData) { setSelectedTitle(categoryData.title); setSelectedSteps([{ id: categoryData.id, title: categoryData.description, image: categoryData.image }]); setScreen('stepNavigator'); } else { alert(`${menuItem.title} selected from menu. Data not found.`); } break; default: console.warn("Unknown menu item target:", menuItem.targetScreen); } };
  const renderAppHeaderForCurrentScreen = () => { const hamburgerScreens = ['mainMenu', 'primaryGuide', 'firstAid', 'directionConnection']; const noHamburgerScreens = ['login', 'signup', 'signupSuccess']; if (hamburgerScreens.includes(screen)) { return <AppHeader showHamburger={true} onMenuPress={toggleMenu} />; } if (noHamburgerScreens.includes(screen)) { return <AppHeader showHamburger={false} onMenuPress={toggleMenu} />; } return null; };
  const renderSubScreen = (title, data, screenNameForBackNav) => ( <SafeAreaView style={styles.appScreenContainer}> {renderAppHeaderForCurrentScreen()} <TouchableOpacity style={[styles.button_General, styles.subScreenBackButton]} onPress={() => setScreen('mainMenu')}> <Text style={styles.buttonText}>Back to Main Menu</Text> </TouchableOpacity> <FlatList data={data} renderItem={({ item }) => renderSubCategory({ item, parentScreen: screenNameForBackNav })} keyExtractor={(item) => item.id} numColumns={2} contentContainerStyle={styles.grid} /> </SafeAreaView> );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.headerBackground} />
      <SideMenu isVisible={isMenuVisible} onClose={toggleMenu} onNavigate={handleMenuNavigation} />
      {(() => {
        if (screen === 'stepNavigator') {
          return <StepNavigatorNew steps={selectedSteps} title={selectedTitle} onBack={() => setScreen(previousScreen)} setScreen={setScreen} previousScreenForStepNav={previousScreen} />;
        }
        switch (screen) {
          case 'mainMenu': return ( <SafeAreaView style={styles.appScreenContainer}> {renderAppHeaderForCurrentScreen()} <FlatList data={categories} renderItem={renderCategory} keyExtractor={(item) => item.id} numColumns={2} contentContainerStyle={styles.grid} ListHeaderComponent={() => <View style={{height:10}}/>} /> </SafeAreaView>);
          case 'primaryGuide': return renderSubScreen('Primary Guide', primaryGuideSubCategories, 'primaryGuide');
          case 'firstAid': return renderSubScreen('First Aid', firstAidSubCategories, 'firstAid');
          case 'directionConnection': return renderSubScreen('Direction & Connection', directionSubCategories, 'directionConnection');
          case 'signupSuccess': return ( <SafeAreaView style={styles.authScreenContainer}> {renderAppHeaderForCurrentScreen()} <View style={styles.formContainer}> <Text style={styles.pageTitle_Auth}>Account Created!</Text> <Text style={styles.confirmText}>Your account has been successfully created.</Text> <TouchableOpacity style={styles.button_Success} onPress={() => setScreen('mainMenu')}> <Text style={styles.buttonText}>Continue to Guide</Text> </TouchableOpacity> </View> </SafeAreaView>);
          default: return ( <SafeAreaView style={styles.authScreenContainer}> {renderAppHeaderForCurrentScreen()} <View style={styles.formContainer}> {screen === 'login' ? ( <> <Text style={styles.pageTitle_Auth}>Welcome</Text> <TextInput style={styles.input} placeholder="Enter your username or email" placeholderTextColor={THEME_COLORS.inputPlaceholder} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" /> <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor={THEME_COLORS.inputPlaceholder} onChangeText={setPassword} value={password} secureTextEntry /> <CustomCheckBox label="Remember Me" value={rememberMe} onValueChange={setRememberMe} /> <TouchableOpacity style={styles.button_Auth} onPress={handleSignIn}><Text style={styles.buttonText}>Sign In</Text></TouchableOpacity> <TouchableOpacity style={styles.button_Auth} onPress={() => setScreen('signup')}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity> </> ) : ( <> <Text style={styles.pageTitle_Auth}>Create Account</Text> <TextInput style={styles.input} placeholder="Choose a username" placeholderTextColor={THEME_COLORS.inputPlaceholder} onChangeText={setUsername} value={username} /> <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={THEME_COLORS.inputPlaceholder} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none"/> <TextInput style={styles.input} placeholder="Create a password" placeholderTextColor={THEME_COLORS.inputPlaceholder} onChangeText={setPassword} value={password} secureTextEntry /> <TextInput style={styles.input} placeholder="Confirm your password" placeholderTextColor={THEME_COLORS.inputPlaceholder} onChangeText={setConfirmPassword} value={confirmPassword} secureTextEntry /> <TouchableOpacity style={styles.button_Auth} onPress={handleSignUp}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity> <TouchableOpacity style={styles.button_Auth} onPress={() => setScreen('login')}><Text style={styles.buttonText}>Back to Sign In</Text></TouchableOpacity> </> )} </View> </SafeAreaView>);
        }
      })()}
    </>
  );
}

const styles = StyleSheet.create({ /* ... (all styles from previous response, unchanged) ... */
  appScreenContainer: { flex: 1, backgroundColor: THEME_COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  authScreenContainer: { flex: 1, backgroundColor: THEME_COLORS.background, paddingHorizontal: 25, justifyContent: 'center', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  formContainer: { width: '100%', },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: THEME_COLORS.headerBackground, paddingVertical: 10, paddingHorizontal: 15, },
  headerLeftContent: { flexDirection: 'row', alignItems: 'center', },
  hamburgerButton: { padding: 8, },
  hamburgerLine: { width: 28, height: 3, backgroundColor: THEME_COLORS.hamburgerColor, marginVertical: 3, borderRadius: 1, },
  headerIconGeneral: { width: 40, height: 40, marginRight: 10, },
  headerTextGeneral: { fontSize: 20, fontWeight: 'normal', color: THEME_COLORS.text, },
  pageTitle_Auth: { fontSize: 30, fontWeight: 'bold', color: THEME_COLORS.brandOrange, marginBottom: 35, textAlign: 'center', },
  input: { backgroundColor: THEME_COLORS.inputBackground, color: THEME_COLORS.text, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: THEME_COLORS.inputBackground, },
  button_Auth: { backgroundColor: THEME_COLORS.brandOrange, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 10, width: '100%', alignSelf: 'center', },
  button_Success: { backgroundColor: THEME_COLORS.brandOrange, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', marginTop: 10, marginBottom: 10, width: '100%', alignSelf: 'center', },
  button_General: { backgroundColor: THEME_COLORS.brandOrange, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 10, width: '100%', alignSelf: 'center', },
  disabledButton: { backgroundColor: THEME_COLORS.disabledButtonBackground, opacity: 0.6 },
  buttonText: { color: THEME_COLORS.buttonTextDark, fontWeight: 'bold', fontSize: 16, },
  subScreenBackButton: { marginTop: 15, marginBottom:15, width: 'auto', paddingHorizontal: 30, marginHorizontal: 20, },
  confirmText: { fontSize: 16, color: THEME_COLORS.text, textAlign: 'center', marginBottom: 30, lineHeight: 24, },
  grid: { paddingHorizontal: 10, paddingBottom: 20, paddingTop: 5 },
  card: { flex: 1, margin: 8, backgroundColor: THEME_COLORS.cardTextContainerBackground, borderRadius: 12, overflow: 'hidden', alignItems: 'flex-start', },
  cardImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 10, resizeMode: 'cover', },
  cardTextContainer: { paddingHorizontal: 5, paddingBottom:10, },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: THEME_COLORS.brandOrange, marginBottom: 5, textAlign: 'left', },
  cardDescription: { fontSize: 13, color: THEME_COLORS.textSecondary, textAlign: 'left', lineHeight: 18, },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start', },
  menuContainer: { height: '100%', backgroundColor: THEME_COLORS.headerBackground, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 45, },
  menuItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor: THEME_COLORS.menuItemBorder},
  menuItemText: { fontSize: 17, color: THEME_COLORS.text, },
  menuItemSeparator: { height: 0 },
  centeredError: {flex: 1, backgroundColor: THEME_COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 20},
  errorText: {color: THEME_COLORS.text, fontSize: 18, textAlign: 'center', marginBottom: 20},
  errorButton: {paddingVertical: 10, paddingHorizontal: 20, backgroundColor: THEME_COLORS.brandOrange, borderRadius: 8},
  stepNavNewBackground: { flex: 1, },
  stepNavNewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  stepNavNewHeaderContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: THEME_COLORS.headerBackground, },
  stepNavNewHeaderIcon: { width: 28, height: 28, marginRight: 10, },
  stepNavNewHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: THEME_COLORS.text, textTransform: 'uppercase', },
  stepNavNewContentArea: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, },
  stepNavNewCard: { backgroundColor: THEME_COLORS.stepNavCardBackground, borderRadius: 12, paddingVertical: 20, paddingHorizontal: 15, alignItems: 'center', width: Dimensions.get('window').width * 0.7, maxHeight: Dimensions.get('window').height * 0.6, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, },
  stepNavNewCardIcon: { width: '100%', height: 150, marginBottom: 15, borderRadius: 8, },
  stepNavNewCardIconPlaceholder: { width: '100%', height: 150, marginBottom: 15, borderRadius: 8, backgroundColor: THEME_COLORS.inputBackground, justifyContent: 'center', alignItems: 'center', },
  stepNavNewCardStepNumber: { fontSize: 15, fontWeight: 'bold', color: THEME_COLORS.text, marginBottom: 8, textTransform: 'uppercase', },
  stepNavNewCardDescription: { fontSize: 13, color: THEME_COLORS.text, textAlign: 'center', lineHeight: 18, },
  stepNavNewSideArrow: { padding: 10, justifyContent: 'center', alignItems: 'center', },
  disabledOpacity: { opacity: 0.2, },
  stepNavNewBottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: THEME_COLORS.headerBackground, paddingVertical: 5, paddingBottom: Platform.OS === 'ios' ? 25 : 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 15, marginBottom: Platform.OS === 'ios' ? 5 : 10, elevation: 8, },
  stepNavNewBottomButton: { padding: 8, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', },
  stepNavNewBottomButtonHome: { width: 56, height: 56, borderRadius: 28, backgroundColor: THEME_COLORS.brandOrange, transform: [{ translateY: -18 }], elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 5, },
});