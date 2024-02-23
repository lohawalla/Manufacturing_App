import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ApplicationStackParamList = {
    Dashboard: undefined;
    CompletedSlip: { data: any[]; type: string };
    Completed:undefined;
    Camera:undefined;
};

export type ApplicationScreenProps =
    NativeStackScreenProps<ApplicationStackParamList>;
