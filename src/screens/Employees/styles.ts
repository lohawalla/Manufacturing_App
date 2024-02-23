import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        // elevation: 3,
        shadowColor: '#000',
        // shadowOffset: { width: '100%', height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        width: '100%',
        // marginRight: '65%',
        maxHeight: '60%'
    },
    itemContainer: {
        marginBottom: 16,
    },
    loginButton: {
        // backgroundColor: '#283093',
        backgroundColor: '#312e81',
        alignItems: 'center',
        padding: responsiveHeight(2),
        borderRadius: 14,
        width: responsiveWidth(42),
        position: 'absolute',
        marginLeft: '55%',
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
    badgeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 12, // Adjust as needed for the desired shape
        width: 24, // Adjust as needed for the desired size
        height: 24, // Adjust as needed for the desired size
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
    },
    tableHeader: {
        backgroundColor: '#ECEDFE',
        borderRadius: 8,
        borderBottomWidth: 1,
        borderColor: '#0000001F',
        height: 55,
        alignItems: 'center', // Center text horizontally and vertically
        justifyContent: 'center',
    },
    columnHeaderText: {
        fontSize: 16,
        color: '#2E2E2E',
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#0000001F',
        backgroundColor: '#F5F5F5', // Alternating row colors
    },
    cellText: {
        fontSize: 14,
        color: '#2E2E2E',
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium',
    },
    tableCell: {
        flex: 1, // Distribute cell content evenly
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnHeader: {
        // width:100
    },
    mainbox: {
        textAlign: 'center',
        margin: 10,
        justifyContent: 'space-between',
        maxHeight: '70%',
    }
})