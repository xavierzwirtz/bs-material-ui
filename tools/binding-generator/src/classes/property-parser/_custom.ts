import Base from './base';
import EnumFactory from './_enum';
import UnionFactory from './_union';

const factory = (propertyType: PropType$Custom) => {
    if (
        propertyType.raw != null &&
        propertyType.raw.indexOf('PropTypes.oneOf') > -1
    ) {
        const match = /PropTypes\.oneOf\(\[((.|\n)*)\]\)/gm.exec(
            propertyType.raw
        );
        if (match != null) {
            const array = match[1].split(',').reduce((prev, value) => {
                const match = /'(.*)'/gm.exec(value);
                if (match) {
                    return [...prev, match[1]];
                }
                return prev;
            }, []);
            return EnumFactory({
                name: 'enum',
                value: array.map(value => ({ value, computed: false }))
            });
        }
    }

    if (
        propertyType.raw != null &&
        propertyType.raw.includes('componentPropType')
    ) {
        return UnionFactory({
            name: 'union',
            value: [{ name: 'string' }, { name: 'func' }, { name: 'Element' }]
        });
    }

    return class PrimitiveParser extends Base {
        private _propertyType: PropType$Custom = propertyType;

        public executeParse() {
            this._reasonType = this._propertyType.reasonType;
            if (typeof this._propertyType.jsType !== 'undefined') {
                this._jsType = this._propertyType.jsType;
            }
            if (typeof this._propertyType.wrapJs !== 'undefined') {
                this._wrapJs = this._propertyType.wrapJs;
            }
        }
    };
};

export default factory;
