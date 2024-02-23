import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { Color, FontFamily, Padding } from "../Dashboard/GlobalStyles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        borderRadius: 8,
        borderBottomWidth: 1, // Add a border at the bottom of the header
        borderColor: '#0000001F', // Border color
    },
    tableDataH: {
        paddingVertical: 15,
        paddingLeft: 24,
        width: 160,
    },
    loginButton: {
        // backgroundColor: '#283093',
        backgroundColor: '#312e81',
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(2),
        borderRadius: 14,
        marginTop: '110%',
        width: responsiveWidth(30),
        position: 'absolute',
        marginLeft: '55%',
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1, // Add a border at the bottom of each row
        borderColor: '#0000001F', // Border colo
        maxHeight: '95%'
    },
    tableData: {
        // paddingVertical: 10,
        paddingLeft: 20,
        width: 160,
        borderRadius: 8,
        height: 55,
        paddingTop: 20
        // borderBottomWidth:0.3,
        // width:80
    },
    outerView: {
        padding: '6%',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: '4%',
        marginRight: '4%',
        borderColor: '#0000001F',
        height: '76%',
    },
    textStyle: {
        color: 'black',
        fontFamily: 'Inter-Medium',
    },
    personal: {
        marginLeft: 20
    },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000'
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#DEDEDE',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: 18, // Increase font size for larger input
        paddingVertical: 12, // Increase padding for larger input
    },
    remainingText: {
        fontSize: 16,
        marginLeft: 8,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align buttons to the right
        marginTop: '5%'
    },
    cancelButton: {
        backgroundColor: '#f43f5e',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
        justifyContent: 'center'
    },
    okButton: {
        backgroundColor: '#312e81',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
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
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        marginTop: 10, // Adjust as needed
        borderWidth: 1,
        borderColor: '#DEDEDE',
        marginLeft: '4%',
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
        elevation: 5,
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
    text: {
        color: Color.neutralN600,
        fontSize: 12,
    },
    new: {
        fontSize: 15,
        fontWeight: 'bold',
    }
})