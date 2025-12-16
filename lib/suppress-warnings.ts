// Suppress deprecation warnings from dependencies (MongoDB, Cloudinary)
// These libraries use url.parse() internally, which is deprecated in Node.js
// This is a known issue and will be fixed in future versions of these libraries

if (typeof process !== 'undefined') {
  const originalEmitWarning = process.emitWarning;
  
  process.emitWarning = function(warning: any, type?: string, code?: string, ctor?: Function) {
    // Suppress DEP0169 warning about url.parse()
    if (
      (typeof warning === 'string' && warning.includes('url.parse()')) ||
      (typeof warning === 'object' && 
       warning?.name === 'DeprecationWarning' && 
       warning?.message?.includes('url.parse()')) ||
      code === 'DEP0169'
    ) {
      // Suppress this specific deprecation warning
      return;
    }
    
    // Call original emitWarning for all other warnings
    return originalEmitWarning.call(process, warning, type, code, ctor);
  };
}

