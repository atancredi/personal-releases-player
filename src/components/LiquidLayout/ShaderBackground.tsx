import React, { useEffect, useRef } from 'react';
import { fragmentShaderSource, vertexShaderSource } from '../../shaders/microscopic_base_v1';

export interface ShaderConfig {
    complexity: number;
    chaos: number;
    density: number;
    viscosity: number;
    crystallize: number;
    merge: number;
    speed: number;
    warpScale: number;
    styleId: number;
    color1: string;
    color2: string;
    color3: string;
    pixelSize: number;
}

const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255].map(v => v / 255);
};

export const ShaderBackground = React.memo((props: ShaderConfig) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const paramsRef = useRef(props);

    // Keep params fresh without re-rendering the canvas DOM element
    useEffect(() => { paramsRef.current = props; }, [props]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // alpha: true is critical for the transparent overlay mode
        const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
        if (!gl) return;

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        const uniforms = {
            u_resolution: gl.getUniformLocation(program, "u_resolution"),
            u_time: gl.getUniformLocation(program, "u_time"),
            u_complexity: gl.getUniformLocation(program, "u_complexity"),
            u_chaos: gl.getUniformLocation(program, "u_chaos"),
            u_density: gl.getUniformLocation(program, "u_density"),
            u_viscosity: gl.getUniformLocation(program, "u_viscosity"),
            u_crystallize: gl.getUniformLocation(program, "u_crystallize"),
            u_merge: gl.getUniformLocation(program, "u_merge"),
            u_speed: gl.getUniformLocation(program, "u_speed"),
            u_warpScale: gl.getUniformLocation(program, "u_warpScale"),
            u_style: gl.getUniformLocation(program, "u_style"),
            u_color1: gl.getUniformLocation(program, "u_color1"),
            u_color2: gl.getUniformLocation(program, "u_color2"),
            u_color3: gl.getUniformLocation(program, "u_color3"),
            u_pixelSize: gl.getUniformLocation(program, "u_pixelSize")
        };

        const startTime = performance.now();
        let resizeTimeout: ReturnType<typeof setTimeout>;

        const resize = () => {
            // MOBILE FIX: Detect mobile screens and heavily throttle the pixel ratio
            const isMobile = window.innerWidth <= 768;

            // Max 1x resolution on phones, Max 2x resolution on desktop monitors
            const maxDpr = isMobile ? 1 : 2;
            const dpr = Math.min(window.devicePixelRatio, maxDpr);

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);

            if (uniforms.u_resolution) {
                gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
            }
        };

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 100);
        });
        resize();

        const render = (time: number) => {
            const p = paramsRef.current;

            if (uniforms.u_time) gl.uniform1f(uniforms.u_time, (time - startTime) * 0.001);
            if (uniforms.u_complexity) gl.uniform1f(uniforms.u_complexity, p.complexity);
            if (uniforms.u_chaos) gl.uniform1f(uniforms.u_chaos, p.chaos);
            if (uniforms.u_density) gl.uniform1f(uniforms.u_density, p.density);
            if (uniforms.u_viscosity) gl.uniform1f(uniforms.u_viscosity, p.viscosity);
            if (uniforms.u_crystallize) gl.uniform1f(uniforms.u_crystallize, p.crystallize);
            if (uniforms.u_merge) gl.uniform1f(uniforms.u_merge, p.merge);
            if (uniforms.u_speed) gl.uniform1f(uniforms.u_speed, p.speed);
            if (uniforms.u_warpScale) gl.uniform1f(uniforms.u_warpScale, p.warpScale);

            if (uniforms.u_style) gl.uniform1i(uniforms.u_style, p.styleId);
            if (uniforms.u_pixelSize) gl.uniform1f(uniforms.u_pixelSize, p.pixelSize);

            if (uniforms.u_color1) gl.uniform3fv(uniforms.u_color1, hexToRgb(p.color1));
            if (uniforms.u_color2) gl.uniform3fv(uniforms.u_color2, hexToRgb(p.color2));
            if (uniforms.u_color3) gl.uniform3fv(uniforms.u_color3, hexToRgb(p.color3));

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            gl.deleteProgram(program);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 w-full h-full block pointer-events-none" />;
});