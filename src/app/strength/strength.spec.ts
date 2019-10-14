import { StrengthPipe } from "./strength.pipe"

describe('StrengthPipe', () => {
    it('should display weak if strength is 5', () => {
        let pipe = new StrengthPipe();
        let value = pipe.transform(5);
        expect(value).toBe('5 (weak)')
    })

    it('should display strong is strength is 10', () => {
        let pipe = new StrengthPipe();
        
        expect(pipe.transform(10)).toEqual('10 (strong)');
    })

    it('should display strong is strength is 21', () => {
        let pipe = new StrengthPipe();
        
        expect(pipe.transform(21)).toEqual('21 (unbelievable)');
    })
})