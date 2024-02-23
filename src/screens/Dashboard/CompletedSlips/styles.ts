import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        borderRadius: 8,
        borderBottomWidth: 1, // Add a border at the bottom of the header
        borderColor: '#0000001F', // Border color
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1, // Add a border at the bottom of each row
        borderColor: '#0000001F', // Border colo
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
    tableDataH: {
        paddingVertical: 15,
        paddingLeft: 24,
        width: 160,
        // borderRadius: 8,  
        // width:50
    },
    outerView: {
        padding: '6%',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: '4%',
        marginRight: '4%',
        borderColor: '#0000001F',
        height: '86%',
    },
    completedItem: {
        backgroundColor: '#bbf7d0',
        borderWidth: 0.7,
        borderBottomColor: '#808080',

    },
    inactiveItem: {
        backgroundColor: '#fecaca',
        borderWidth: 0.7,
        borderBottomColor: '#808080',

    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: undefined,
        aspectRatio: 1, // To maintain a square format
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        color: 'white',
    },
    closeText: {
        marginTop: 10,
        fontSize: 18,
        color: 'black',
    },
    activeItem: {
        backgroundColor: '#fed7aa',
        borderWidth: 0.7,
        borderBottomColor: '#808080',
    },
    textStyle: {
        color: 'black',
        fontFamily: 'Inter-Medium',
    },
    personal: {
        marginLeft: 20,
    },
    searchBarContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#DEDEDE',
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
        color: 'black',
    },
    dateFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 10,
        borderColor: '#283093',
        borderWidth: 1,
        borderRadius: 10, // Adjust the border radius as needed
        paddingHorizontal: 12,
        paddingVertical: '3.5%',
        maxWidth: 200,
        marginLeft: '25%'
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: '#283093'
    },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    // modalContent: {
    //     width: '80%',
    //     backgroundColor: 'white',
    //     borderRadius: 8,
    //     padding: 16,
    // },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000',
        borderBottomWidth: 1
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 16,
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
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    okButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
    disabledButton: {
        // Style for the disabled button
        backgroundColor: 'gray', // Gray background color for disabled button
        opacity: 0.6, // Reduce opacity for a disabled appearance
    },
    card: {
        flexDirection: 'column',
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
})