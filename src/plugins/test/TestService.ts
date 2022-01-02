import {ref} from 'vue';

export default class TestService {

    public counter = ref(0);

    constructor(private settings: any) {
        console.debug('[TestService] initialized', settings.uselessButton);
    }
}
