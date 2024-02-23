import { Dimensions, StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: responsiveHeight(1),
    },
    sliderContainer: {
        width: '90%',
        height: 50,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e7e5e4',
    },
    clickableArea: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#283093'
    },
    slider: {
        position: 'absolute',
        width: '48%',
        height: '90%',
        borderRadius: 30,
        backgroundColor: '#f4f4f4',
    },
    loginButton: {
        backgroundColor: '#283093',
        // backgroundColor: '#9ca3af',
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(4),
        borderRadius: 14,
        marginTop: '110%',
        width: responsiveWidth(35),
        position: 'absolute',
        marginLeft: '55%',
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
    // container: {
    //     ...StyleSheet.absoluteFillObject,
    // },
    user: {
        width: Dimensions.get('screen').width - 32,
        alignSelf: 'center',
        marginVertical: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        marginLeft: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },
    name: {
        color: '#424242',
        fontSize: 16,
        fontWeight: '600',
    },
    email: {
        marginTop: 6,
        color: '#888',
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
        borderRadius: 10
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    button: {
        borderRadius: 5,
        marginTop: responsiveHeight(70),
        backgroundColor: '#283093',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        width: '100%',
        position: 'absolute',
        flex: 1,
    },
    buttonText1: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
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
        marginRight: '65%',
        maxHeight: '60%'
    },
});