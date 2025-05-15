// declarations/react-native-picker.d.ts
import React from 'react';
import { Component } from 'react';
import type { ViewProps } from 'react-native';

// On ré-déclare le module et on précise bien la signature générique de Picker
declare module '@react-native-picker/picker' {
    export interface PickerProps<T> extends ViewProps {
        selectedValue?: T;
        onValueChange?: (itemValue: T, itemIndex: number) => void;
        children?: React.ReactNode;
        style?: any;
    }

    export default class Picker<T = any> extends Component<PickerProps<T>> {
        static Item: React.ComponentType<{ label: string; value: T }>;
    }
}
