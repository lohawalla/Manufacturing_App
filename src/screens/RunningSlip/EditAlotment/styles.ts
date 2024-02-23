import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    TopText: {
        color: '#666666', fontWeight: '500', marginTop: -70, textDecorationLine: 'underline', marginLeft: -20
    },
    InputDuo: { width: '40%', height: '70%', borderRadius: 5, borderWidth: 0.3, marginTop: 10 },
    TopGap: { marginTop: '10%', fontSize: 18, color: '#1C1C1C', fontWeight: '400' },
    InputText: {
        width: '100%', height: '20%', marginTop: 6, borderRadius: 5, borderWidth: 0.3,
    },
    BTextStyle: { color: 'white', fontWeight: '500', fontSize: 19, marginLeft: 10, flexWrap: 'wrap' },
    BtnStyle: { backgroundColor: '#283093', marginLeft: '50%', borderRadius: 9, padding: 8, justifyContent: 'center', width: '50%', marginBottom: -50 },
    modal: {
        justifyContent: 'flex-end',
        margin: 0
    },
    modalContainer: {
        backgroundColor: 'white',
        // paddingHorizontal: 16,
        paddingTop: 20,
        // alignItems: 'center',
        borderRadius: 10
    },
    modalText: { color: '#B0B0B0', fontWeight: '600', fontSize: 18, letterSpacing: 1.5 },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
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
        backgroundColor: 'gray', // Gray background color for disabled button
        opacity: 0.6, // Reduce opacity for a disabled appearance
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
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
})