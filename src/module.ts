import {
  NativeEventEmitter,
  NativeModules,
  PixelRatio,
  Platform,
} from 'react-native'

const { RNAndroidKeyboard: KBModule } = NativeModules

const SOFT_INPUT_MODES = {
  SOFT_INPUT_ADJUST_NOTHING: KBModule.SOFT_INPUT_ADJUST_NOTHING,
  SOFT_INPUT_ADJUST_PAN: KBModule.SOFT_INPUT_ADJUST_PAN,
  SOFT_INPUT_ADJUST_RESIZE: KBModule.SOFT_INPUT_ADJUST_RESIZE,
  SOFT_INPUT_ADJUST_UNSPECIFIED: KBModule.SOFT_INPUT_ADJUST_UNSPECIFIED,
  SOFT_INPUT_IS_FORWARD_NAVIGATION: KBModule.SOFT_INPUT_IS_FORWARD_NAVIGATION,
  SOFT_INPUT_MASK_ADJUST: KBModule.SOFT_INPUT_MASK_ADJUST,
  SOFT_INPUT_MASK_STATE: KBModule.SOFT_INPUT_MASK_STATE,
  SOFT_INPUT_MODE_CHANGED: KBModule.SOFT_INPUT_MODE_CHANGED,
  SOFT_INPUT_STATE_ALWAYS_HIDDEN: KBModule.SOFT_INPUT_STATE_ALWAYS_HIDDEN,
  SOFT_INPUT_STATE_ALWAYS_VISIBLE: KBModule.SOFT_INPUT_STATE_ALWAYS_VISIBLE,
  SOFT_INPUT_STATE_HIDDEN: KBModule.SOFT_INPUT_STATE_HIDDEN,
  SOFT_INPUT_STATE_UNCHANGED: KBModule.SOFT_INPUT_STATE_UNCHANGED,
  SOFT_INPUT_STATE_UNSPECIFIED: KBModule.SOFT_INPUT_STATE_UNSPECIFIED,
  SOFT_INPUT_STATE_VISIBLE: KBModule.SOFT_INPUT_STATE_VISIBLE,
}

const eventEmitter = new NativeEventEmitter(KBModule)

export type AndroidKeyboardEventListener = (height: number) => void

export enum SoftInputMode {
  SOFT_INPUT_ADJUST_NOTHING = 'SOFT_INPUT_ADJUST_NOTHING',
  SOFT_INPUT_ADJUST_PAN = 'SOFT_INPUT_ADJUST_PAN',
  SOFT_INPUT_ADJUST_RESIZE = 'SOFT_INPUT_ADJUST_RESIZE',
  SOFT_INPUT_ADJUST_UNSPECIFIED = 'SOFT_INPUT_ADJUST_UNSPECIFIED',
  SOFT_INPUT_IS_FORWARD_NAVIGATION = 'SOFT_INPUT_IS_FORWARD_NAVIGATION',
  SOFT_INPUT_MASK_ADJUST = 'SOFT_INPUT_MASK_ADJUST',
  SOFT_INPUT_MASK_STATE = 'SOFT_INPUT_MASK_STATE',
  SOFT_INPUT_MODE_CHANGED = 'SOFT_INPUT_MODE_CHANGED',
  SOFT_INPUT_STATE_ALWAYS_HIDDEN = 'SOFT_INPUT_STATE_ALWAYS_HIDDEN',
  SOFT_INPUT_STATE_ALWAYS_VISIBLE = 'SOFT_INPUT_STATE_ALWAYS_VISIBLE',
  SOFT_INPUT_STATE_HIDDEN = 'SOFT_INPUT_STATE_HIDDEN',
  SOFT_INPUT_STATE_UNCHANGED = 'SOFT_INPUT_STATE_UNCHANGED',
  SOFT_INPUT_STATE_UNSPECIFIED = 'SOFT_INPUT_STATE_UNSPECIFIED',
  SOFT_INPUT_STATE_VISIBLE = 'SOFT_INPUT_STATE_VISIBLE',
}

export class AndroidKeyboardStatic {
  private initialized: boolean
  private listeners: AndroidKeyboardEventListener[]

  constructor() {
    this.initialized = false
    this.listeners = []
  }

  setWindowSoftInputMode(mode: SoftInputMode) {
    this.checkPlatform()

    return KBModule.setWindowSoftInputMode(SOFT_INPUT_MODES[mode])
  }

  addListener(listener: AndroidKeyboardEventListener) {
    this.checkPlatform()
    this.ensureInitialized()

    this.listeners.push(listener)
  }

  removeListener(listener: AndroidKeyboardEventListener) {
    this.checkPlatform()

    this.listeners = this.listeners.filter(cb => cb !== listener)
  }

  private ensureInitialized() {
    this.checkPlatform()

    if (!this.initialized) {
      KBModule.startKeyboardListener()

      eventEmitter.addListener('keyboardDidChangeHeight', (height: number) => {
        const keyboardHeight = height / PixelRatio.get()

        this.listeners.forEach(listener => listener(keyboardHeight))
      })

      this.initialized = true
    }
  }

  private checkPlatform() {
    if (Platform.OS !== 'android') {
      throw new Error('Try to use Android only module')
    }
  }
}

export const AndroidKeyboard = new AndroidKeyboardStatic()