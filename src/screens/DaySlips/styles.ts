import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    searchBarContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56%',
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
})