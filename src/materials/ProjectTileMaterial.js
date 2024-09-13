import * as THREE from 'three';

const vertexShader = `
    uniform float taperAmount;
    varying vec2 vUv;

    void main() {    
        // Apply taper factor to the x and z coordinates
        vec3 newPosition = position;

        // // newPosition.x *= 1.0 - mix(0.0, uv.y, taperAmount);
        // vec2 newUv = uv;
        // float uvY = uv.y;
        // // uvY = (uvY - taperAmount);
        // if (uvY < float(taperAmount))
        // {
        //     newPosition.x = 0.0;
        // }
        // else 
        // {
        //     // newPosition.x = 1.0;
        // }

        float y = uv.y;
        y = y;            
        // newPosition.x *= y * taperAmount;
        // if (newPosition.x < 0.0)
        {
            newPosition.x *= y;
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    
        vUv = uv;
    }
`;

const fragmentShader = `
    uniform sampler2D map;
    varying vec2 vUv;

    void main() {
        vec4 textureColor = texture2D(map, vUv);
        gl_FragColor = vec4(vUv.y);
    }
`;

export default class ProjectTileMaterial extends THREE.ShaderMaterial {
    uniformValues = {
        taperAmount: { value: 0 }
    }

    constructor() {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                taperAmount: { value: 1 }
            }
        });

        this.uniforms = this.uniformValues;
    }
}
