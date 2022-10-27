import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage } from 'vee-validate'
import { required, min, max, alpha_spaces as alphaSpaces, email, min_value as minVal, max_value as maxVal, confirmed, is_not as excluded } from '@vee-validate/rules';

export default {
    install(app) {
        app.component("VeeForm", VeeForm)
        app.component("VeeField", VeeField)
        app.component("ErrorMessage", ErrorMessage)

        defineRule("required", required)
        defineRule("min", min)
        defineRule("max", max)
        defineRule("alphaSpaces", alphaSpaces)
        defineRule("email", email)
        defineRule("maxVal", maxVal)
        defineRule("minVal", minVal)
        defineRule("confirmed", confirmed)
        defineRule("excluded", excluded)

    }
}
