import { StyleSheet } from 'react-native';
import { Border, Color, FontFamily, FontSize, Padding } from '../Dashboard/GlobalStyles';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
export const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: '#283093',
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(9),
        borderRadius: 14,
        marginTop: responsiveHeight(65),
        width: responsiveWidth(35),
        position: 'absolute',
        marginLeft: '55%',
    },
    buttonText: {
        color: 'white',
        paddingLeft: responsiveWidth(2),
        fontSize: 17
    },
    parentFrameFlexBox: {
        justifyContent: 'space-around',
        flexDirection: "row",
        alignItems: 'center',
        flex: 1,
        marginTop: responsiveHeight(1)
    },
    scanSlipTypo: {
        textAlign: "left",
        fontFamily: FontFamily.interMedium,
        fontWeight: "500",
    },
    frameLayout: {
        width: 360,
        position: "absolute",
    },
    parentFlexBox: {
        padding: Padding.p_base,
        backgroundColor: Color.colorLavender,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
    },
    wireShopLayout: {
        lineHeight: 22,
        textAlign: "left",
    },
    textTypo: {
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "left",
        fontFamily: FontFamily.interMedium,
        fontWeight: "500",
    },
    frameBorder: {
        borderColor: Color.colorGainsboro,
        borderStyle: "solid",
    },
    text22: {
        color: 'black', // Default text color (black)
        // Other text styles
    },
    
    text223: {
        elevation:5,
        fontWeight: "bold",
    },
    blueText: {
        color: '#283093', // Blue text color
        // Other styles for blue text
    },
    frameGroupSpaceBlock: {
        paddingVertical: Padding.p_base,
        position: "absolute",
        alignItems: "center",
        paddingHorizontal: Padding.p_xl,
    },
    metalogoIcon: {
        width: 28,
        height: 28,
        overflow: "hidden",
    },
    chawlaIspat: {
        lineHeight: 25,
        marginLeft: 6.13,
        color: Color.blueMainM500,
        fontSize: 18,
    },
    metalogoParent: {
        alignItems: "center",
        flexDirection: "row",
    },
    frameChild: {
        width: 36,
        height: 36,
    },
    frameGroup: {
        top: 41,
        left: -1,
        backgroundColor: Color.neutralN10,
        borderWidth: 1,
        width: 362,
        alignItems: "center",
        paddingVertical: Padding.p_base,
        position: "absolute",
        paddingHorizontal: Padding.p_xl,
        borderColor: Color.colorGainsboro,
        borderStyle: "solid",
    },
    frameItem: {
        backgroundColor: "#000",
        height: 42,
        left: 0,
        width: 360,
        top: 0,
    },
    usersIcon: {
        width: 20,
        height: 20,
    },
    employees: {
        lineHeight: 19,
        marginLeft: 16,
        fontSize: FontSize.size_sm,
        color: Color.blueMainM500,
    },
    gearfineParent: {
        marginLeft: 12,
    },
    frameView: {
        zIndex: 0,
        alignSelf: "stretch",
        flexDirection: "row",
    },
    wireShop: {
        letterSpacing: 1.4,
        fontWeight: "600",
        fontFamily: FontFamily.interSemiBold,
        color: Color.neutralN60,
        fontSize: FontSize.size_xs,
    },
    activeWorkOrders: {
        fontWeight: "700",
        fontFamily: FontFamily.interBold,
        marginTop: 4,
        color: Color.neutralN600,
        fontSize: 20,
    },
    wireShopParent: {
        alignSelf: "stretch",
    },
    text: {
        color: Color.neutralN600,
        fontSize: 12,
    },
    text2: {
        color: Color.neutralN600,
        fontSize: 15,
        position: 'relative'
    },
    frameInner: {
        borderRightWidth: responsiveWidth(1),
        width: responsiveWidth(1),
        height: responsiveHeight(3),
        marginLeft: responsiveWidth(-15),
        flex: 1,
        overflow: 'visible'
    },
    parent: {
        width: 180,
        alignItems: "center",
    },
    items: {
        color: Color.neutralN200,
        marginTop: 5,
        fontSize: FontSize.size_xs,
    },
    frameParent4: {
        paddingTop: Padding.p_11xs,
    },
    text1: {
        fontSize: FontSize.size_xs,
        color: Color.blueMainM500,
    },
    receiptIcon: {
        width: 16,
        height: 16,
        marginLeft: 4,
    },
    group: {
        borderRadius: Border.br_7xl,
        paddingHorizontal: Padding.p_xs,
        paddingVertical: Padding.p_9xs,
        alignItems: "center",
        flexDirection: "row",
    },
    frameParent3: {
        paddingHorizontal: 0,
        paddingVertical: Padding.p_xl,
        alignSelf: "stretch",
        flex: 1,
        justifyContent: 'space-between',
        alignItems: "center"
    },
    lineView: {
        borderColor: Color.colorWhitesmoke,
        borderTopWidth: 1,
        height: 1,
        alignSelf: "stretch",
        borderStyle: "solid",
    },
    frameParent2: {
        paddingLeft: Padding.p_base,
        justifyContent: "center",
        marginTop: 12,
        alignSelf: "stretch",
        alignItems: "center",
    },
    frameParent1: {
        zIndex: 1,
        marginTop: 40,
        alignSelf: "stretch",
    },
    scanIcon: {
        width: 24,
        height: 24,
    },
    scanSlip: {
        color: Color.neutralN0,
        marginLeft: 10,
        fontSize: FontSize.size_sm,
    },
    scanParent: {
        top: 558,
        right: 20,
        borderRadius: 14,
        backgroundColor: Color.blueMainM500,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowRadius: 8,
        elevation: 8,
        shadowOpacity: 1,
        zIndex: 2,
        alignItems: "center",
        flexDirection: "row",
    },
    frameContainer: {
        paddingVertical: 32,
        left: 0,
        width: 360,
        top: 0,
        paddingHorizontal: Padding.p_xl,
        overflow: "hidden",
        backgroundColor: Color.neutralN0,
    },
    frameWrapper: {
        top: 110,
        height: 609,
        left: 0,
        width: 360,
    },
    icon: {
        marginLeft: -180,
        height: "100%",
        width: "100%",
    },
    screenshot20230711162355: {
        left: "50%",
        bottom: 0,
        height: 40,
    },
    frameParent: {
        height: 804,
        overflow: "hidden",
        width: "100%",
        flex: 1,
        backgroundColor: Color.neutralN0,
    },
    seperate: {
        marginLeft: responsiveWidth(1.2),
        flex: 1,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    button1: {
        backgroundColor: Color.blueMainM500,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText1: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        // flexDirection: 'row',
        padding: 25,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 1,
        marginLeft: '5%',
        marginRight: '5%',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
        color: '#333',
    },
    searchInput: {
        fontSize: 16,
        height: 48,
        flex: 1,
        color: 'black'
    },
    searchBarContainer: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '92%',
        marginTop: 20, // Adjust as needed
        borderWidth: 1,
        borderColor: '#DEDEDE',
        marginLeft: '4%',
    },
    blueText00: {
        color: '#27AE60'
    },
    Purchase: {
        borderWidth: 1,
        paddingVertical: 20,
        backgroundColor: '#E2F6F7',
        flexDirection: 'row',
        width: '43%',
        borderRadius: 50,

    },
    Sales: {
        borderWidth: 1,
        paddingVertical: 20,
        backgroundColor: '#E0F3EE',
        flexDirection: 'row',
        width: '43%',
        borderRadius: 50
    },
    text4: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 19.46,
        textAlignVertical: 'center',
        textAlign: 'center',
        marginLeft: 8
    },
    badgeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 50, // Adjust as needed for the desired shape
        paddingHorizontal: 8, // Add horizontal padding to give some space around the content
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 25, // Set a minimum width to ensure it's not too small
        minHeight: 25, // Set a minimum height to ensure it's not too small
    },
    badgeContainer1: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#22c55e',
        borderRadius: 30, // Adjust as needed for the desired shape
        paddingHorizontal: 8, // Add horizontal padding to give some space around the content
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 25, // Set a minimum width to ensure it's not too small
        minHeight: 25, // Set a minimum height to ensure it's not too small
    },
    badgeText: {
        color: 'white',
    },
    scrollContainer: {
        flex: 1,
    },
    container: {
        height: 200, // Set the fixed height to limit scrolling
        overflow: 'hidden', // Hide content that exceeds the container's bounds
    },
    redText: {
        color: 'red', // Set the text color for 'cancel' status to red
    },
    greenText: {
        color: 'green', // Set the text color for status other than 'cancel' to green
    },
    new: {
        fontSize: 15,
        fontWeight: 'bold',
    }
});